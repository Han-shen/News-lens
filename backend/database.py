from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")

client = AsyncIOMotorClient(MONGODB_URI)
db = client.newslens_db

# Collections
predictions_collection = db.predictions

async def init_db():
    # Create indexes if they don't exist
    await predictions_collection.create_index([("category", 1)])
    await predictions_collection.create_index([("created_at", -1)])
