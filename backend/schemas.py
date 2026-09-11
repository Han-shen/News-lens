from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ClassifyRequest(BaseModel):
    text: str = Field(..., min_length=10, max_length=10000, description="The article text to classify.")

class PipelineDetail(BaseModel):
    original_length: int
    cleaned_length: int
    cleaned_text: str
    extracted_terms: List[str]

class ClassifyResponse(BaseModel):
    category: str
    confidence: float
    processing_time: float
    pipeline_details: PipelineDetail

class HistoryItem(BaseModel):
    id: str
    text_preview: str
    category: str
    confidence: float
    processing_time: float
    created_at: str

class StatsResponse(BaseModel):
    total_articles: int
    category_counts: dict

class ModelInfoResponse(BaseModel):
    model_name: str
    categories: List[str]
    training_samples: int
    test_samples: int
    accuracy: float
    precision: float
    recall: float
    f1: float
