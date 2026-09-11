# NewsLens - NLP College Project

NewsLens is a full-stack web application that uses Natural Language Processing (NLP) and Machine Learning (ML) to automatically classify news articles into one of five categories: Sports, Politics, Technology, Business, and Entertainment.

## Problem Statement & Objectives
With the massive influx of digital news content daily, manually categorizing articles is inefficient and time-consuming. NewsLens automates this process using Machine Learning. The objective of this project is to demonstrate an end-to-end NLP pipeline integrated within a modern web architecture.

## Features
- **Real-time Classification:** Paste any news article to get an instant category prediction.
- **Confidence Scores:** View the model's confidence probability.
- **Pipeline Breakdown:** See how the article was processed (cleaning, tokenization, TF-IDF).
- **History & Analytics:** All predictions are saved to MongoDB, allowing users to view history and overall dataset statistics.

## Tech Stack
- **Frontend:** React, Tailwind CSS, Vite, Recharts, Lucide React
- **Backend:** FastAPI, Python, Motor (Async MongoDB Driver)
- **Machine Learning:** Scikit-learn, NLTK, Pandas, NumPy
- **Database:** MongoDB

## Architecture
1. The user inputs text via the React UI.
2. The frontend sends a `POST` request to the FastAPI backend.
3. The backend preprocesses the text (lowercasing, removing stopwords/punctuation, tokenization).
4. The text is vectorized using a pre-trained TF-IDF model.
5. A Logistic Regression model predicts the category and calculates the confidence score.
6. The prediction is returned to the frontend and asynchronously saved to MongoDB.

## Installation & Running

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB (running locally on default port 27017 or provide an Atlas URI)

### Quick Start (Windows)
We have provided a convenient batch script to start the entire project:
```bash
./run_project.bat
```
This script will:
1. Create a Python virtual environment and install dependencies.
2. Generate a demo dataset and train the NLP model.
3. Install frontend dependencies.
4. Start both the FastAPI backend (Port 8000) and Vite frontend (Port 5173).

### Manual Setup
**1. Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python train_model.py
uvicorn main:app --reload
```

**2. Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Limitations & Future Scope
- **Limitations:** The model relies on a simplistic TF-IDF approach, which doesn't capture deep semantic context as well as transformer models. Sarcasm or highly nuanced texts might be misclassified.
- **Future Scope:** Implement BERT embeddings, add a fake-news detection pipeline, and integrate live news API feeds for real-time aggregation.

---
*Built for College Final Year Project Demonstration.*
