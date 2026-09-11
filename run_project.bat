@echo off
echo ===================================================
echo Starting NewsLens Project...
echo ===================================================

cd backend
echo Setting up backend...
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
echo Installing requirements...
pip install -r requirements.txt
echo Training model (if needed)...
python train_model.py
echo Starting FastAPI backend on port 8000...
start cmd /k "title Backend Server && uvicorn main:app --reload"

cd ..\frontend
echo Setting up frontend...
call npm install
echo Starting React Vite server...
start cmd /k "title Frontend Server && npm run dev"

echo ===================================================
echo Services are starting in new windows!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
echo ===================================================
pause
