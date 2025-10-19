# main.py
import os
import requests
from fastapi import FastAPI, Query
from pydantic import BaseModel
from dotenv import load_dotenv
from pinecone import Pinecone

load_dotenv()

# --- Environment variables ---
HF_API_KEY = os.getenv("HF_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX")
NAMESPACE = os.getenv("PINECONE_NAMESPACE") or None

# --- Initialize Pinecone ---
pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(INDEX_NAME)

# --- FastAPI setup ---
app = FastAPI(title="AI Recommendation API")

# --- Models ---
class QueryRequest(BaseModel):
    query: str
    top_k: int = 5

# --- Helper: get embedding from Hugging Face ---
def get_embedding_hf(text: str):
    url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    payload = {"inputs": text}

    response = requests.post(url, headers=headers, json=payload)
    if response.status_code != 200:
        raise Exception(f"HuggingFace API error: {response.text}")
    return response.json()[0]  # returns a vector (list of floats)

# --- Query endpoint ---
@app.post("/recommend")
def recommend(req: QueryRequest):
    # 1️⃣ Generate embedding via HF
    query_vector = get_embedding_hf(req.query)

    # 2️⃣ Query Pinecone
    result = index.query(
        vector=query_vector,
        top_k=req.top_k,
        include_metadata=True,
        namespace=NAMESPACE
    )

    # 3️⃣ Format output
    recommendations = [
        {
            "id": match["id"],
            "score": match["score"],
            "metadata": match["metadata"]
        }
        for match in result["matches"]
    ]
    return {"query": req.query, "results": recommendations}

@app.get("/")
def root():
    return {"message": "Recommendation API is running!"}
