import joblib
import os
import time
from preprocessing import preprocess_text, extract_important_terms

class NLPClassifier:
    def __init__(self):
        self.clf = None
        self.vectorizer = None
        self.metrics = None
        self.load_model()

    def load_model(self):
        model_path = "model/classifier.pkl"
        vec_path = "model/vectorizer.pkl"
        metrics_path = "model/metrics.pkl"
        
        if os.path.exists(model_path) and os.path.exists(vec_path):
            self.clf = joblib.load(model_path)
            self.vectorizer = joblib.load(vec_path)
            if os.path.exists(metrics_path):
                self.metrics = joblib.load(metrics_path)
        else:
            print("Model artifacts not found. Please train the model first.")

    def classify(self, text: str):
        if not self.clf or not self.vectorizer:
            raise ValueError("Model is not loaded.")
            
        start_time = time.time()
        
        # Preprocessing
        cleaned_text = preprocess_text(text)
        
        # Transform
        vec_text = self.vectorizer.transform([cleaned_text])
        
        # Predict
        pred = self.clf.predict(vec_text)[0]
        probs = self.clf.predict_proba(vec_text)[0]
        confidence = float(max(probs))
        
        end_time = time.time()
        processing_time = round(end_time - start_time, 4)
        
        terms = extract_important_terms(cleaned_text, top_n=5)
        
        pipeline_details = {
            "original_length": len(text.split()),
            "cleaned_length": len(cleaned_text.split()),
            "cleaned_text": cleaned_text,
            "extracted_terms": terms
        }
        
        return {
            "category": pred,
            "confidence": confidence,
            "processing_time": processing_time,
            "pipeline_details": pipeline_details
        }

classifier_instance = NLPClassifier()
