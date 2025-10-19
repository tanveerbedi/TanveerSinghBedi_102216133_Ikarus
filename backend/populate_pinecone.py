# populate_pinecone.py

import os
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from pinecone import Pinecone
from tqdm import tqdm

# Load environment variables
load_dotenv()

API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX")
NAMESPACE = os.getenv("PINECONE_NAMESPACE") or None

# Initialize Pinecone client
pc = Pinecone(api_key=API_KEY)
index = pc.Index(INDEX_NAME)

print("✅ Connected to Pinecone index:", INDEX_NAME)

# Load embeddings and dataset
embeddings = np.load("product_embeddings.npy") 
df = pd.read_csv("dataset_with_ids.csv")

if "id" not in df.columns:
    df["id"] = df.index.astype(str)

assert embeddings.shape[0] == len(df), \
    f"Mismatch: embeddings count {embeddings.shape[0]} vs dataset rows {len(df)}"

BATCH_SIZE = 100
print(f"📦 Uploading in batches of {BATCH_SIZE}...")

for start in tqdm(range(0, len(df), BATCH_SIZE)):
    end = start + BATCH_SIZE
    batch_df = df.iloc[start:end]
    batch_ids = batch_df["id"].astype(str).tolist()
    batch_vecs = embeddings[start:end].tolist()
    batch_meta = []

    for _, row in batch_df.iterrows():
        # Sanitize metadata to remove NaNs and ensure valid types
        meta = {
            "title": str(row.get("title", "")),
            "description": str(row.get("description", ""))[:500],
            "image_url": str(row.get("image_url", "")),
            "product_url": str(row.get("product_url", "")),
            "country": str(row.get("country", "")),
            "color": str(row.get("color", "")),
            "material": str(row.get("material", ""))
        }

        # Only include price if it's a valid number (not NaN)
        price = row.get("price")
        if pd.notnull(price):
            try:
                # Remove $, commas, and convert to float
                cleaned_price = float(str(price).replace("$", "").replace(",", "").strip())
                meta["price"] = cleaned_price
            except ValueError:
                # Skip invalid price formats
                pass

        # ✅ Append metadata to list
        batch_meta.append(meta)

    # Prepare vector objects for Pinecone
    vectors = [
        {
            "id": _id,
            "values": vec,
            "metadata": meta
        }
        for _id, vec, meta in zip(batch_ids, batch_vecs, batch_meta)
    ]

    if vectors:
        print(f"🚀 Uploading {len(vectors)} vectors (IDs {batch_ids[0]} to {batch_ids[-1]})...")
        index.upsert(vectors=vectors, namespace=NAMESPACE)
    else:
        print("⚠️ Skipped empty batch!")

print("🎉 Upsert complete!")

# Optionally view index stats
stats = index.describe_index_stats()
print("📊 Index stats:", stats)
