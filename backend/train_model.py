import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, confusion_matrix
import joblib
import os
import time

from preprocessing import preprocess_text

def train():
    print("Loading dataset...")
    df = pd.read_csv("data/news_dataset.csv")
    
    # Preprocess
    print("Preprocessing text...")
    df['cleaned_text'] = df['text'].apply(preprocess_text)
    
    X = df['cleaned_text']
    y = df['category']
    
    print("Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Vectorizing...")
    vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1,2), stop_words="english")
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    print("Training Logistic Regression...")
    clf = LogisticRegression(random_state=42, max_iter=1000, C=100.0) # High C for sharper confidence scores
    clf.fit(X_train_vec, y_train)
    
    print("Evaluating...")
    y_pred = clf.predict(X_test_vec)
    accuracy = accuracy_score(y_test, y_pred)
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted', zero_division=0)
    
    metrics = {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1": f1,
        "training_samples": len(X_train),
        "test_samples": len(X_test),
        "categories": list(clf.classes_)
    }
    
    print(f"Accuracy: {accuracy:.4f}")
    
    print("Saving artifacts...")
    os.makedirs("model", exist_ok=True)
    joblib.dump(clf, "model/classifier.pkl")
    joblib.dump(vectorizer, "model/vectorizer.pkl")
    joblib.dump(metrics, "model/metrics.pkl")
    print("Training complete.")

if __name__ == "__main__":
    train()
