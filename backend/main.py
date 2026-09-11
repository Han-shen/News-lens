from fastapi import FastAPI, HTTPException, status
# Trigger backend reload after model retrain
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import schemas
from database import init_db, predictions_collection
from classifier import classifier_instance
import os
import subprocess

app = FastAPI(title="NewsLens API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow dev frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await init_db()
    # Check if model needs training
    if not os.path.exists("model/classifier.pkl"):
        print("Model not found. Triggering data generation and training...")
        if not os.path.exists("data/news_dataset.csv"):
            import generate_data
            generate_data.generate_dataset()
        import train_model
        train_model.train()
        classifier_instance.load_model()

@app.get("/")
def read_root():
    return {"message": "Welcome to NewsLens API"}

@app.get("/api/health")
def health_check():
    return {"status": "ok", "model_loaded": classifier_instance.clf is not None}

@app.post("/api/classify", response_model=schemas.ClassifyResponse)
async def classify_article(req: schemas.ClassifyRequest):
    if not classifier_instance.clf:
        raise HTTPException(status_code=503, detail="Model not loaded. Please train first.")
        
    try:
        result = classifier_instance.classify(req.text)
        
        # Save to DB
        doc = {
            "text": req.text,
            "category": result["category"],
            "confidence": result["confidence"],
            "processing_time": result["processing_time"],
            "created_at": datetime.utcnow()
        }
        await predictions_collection.insert_one(doc)
        
        return schemas.ClassifyResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Classification failed.")

@app.get("/api/history")
async def get_history(limit: int = 50, category: str = None):
    query = {}
    if category:
        query["category"] = category
        
    cursor = predictions_collection.find(query).sort("created_at", -1).limit(limit)
    history = []
    async for doc in cursor:
        history.append({
            "id": str(doc["_id"]),
            "text_preview": doc["text"][:100] + "..." if len(doc["text"]) > 100 else doc["text"],
            "category": doc["category"],
            "confidence": doc["confidence"],
            "processing_time": doc["processing_time"],
            "created_at": doc["created_at"].isoformat()
        })
    return history

@app.delete("/api/history")
async def clear_history():
    await predictions_collection.delete_many({})
    return {"message": "History cleared"}

@app.get("/api/stats", response_model=schemas.StatsResponse)
async def get_stats():
    total = await predictions_collection.count_documents({})
    pipeline = [
        {"$group": {"_id": "$category", "count": {"$sum": 1}}}
    ]
    cursor = predictions_collection.aggregate(pipeline)
    counts = {}
    async for doc in cursor:
        counts[doc["_id"]] = doc["count"]
        
    return {"total_articles": total, "category_counts": counts}

@app.get("/api/model-info", response_model=schemas.ModelInfoResponse)
def get_model_info():
    if not classifier_instance.metrics:
        raise HTTPException(status_code=404, detail="Metrics not found.")
    
    m = classifier_instance.metrics
    return {
        "model_name": "Logistic Regression + TF-IDF",
        "categories": m.get("categories", []),
        "training_samples": m.get("training_samples", 0),
        "test_samples": m.get("test_samples", 0),
        "accuracy": m.get("accuracy", 0),
        "precision": m.get("precision", 0),
        "recall": m.get("recall", 0),
        "f1": m.get("f1", 0)
    }

@app.get("/api/categories")
def get_categories():
    if classifier_instance.metrics:
        return classifier_instance.metrics.get("categories", [])
    return ["Sports", "Politics", "Technology", "Business", "Entertainment"]

@app.post("/api/train")
def trigger_training():
    try:
        import generate_data
        generate_data.generate_dataset()
        import train_model
        train_model.train()
        classifier_instance.load_model()
        return {"message": "Training successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Training failed.")
