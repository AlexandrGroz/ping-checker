@echo off
setlocal enabledelayedexpansion

echo Checking virtual environment...
if not exist ping-checker-venv (
    echo Virtual environment not found. Creating new one...
    python -m venv ping-checker-venv
)

echo Activating virtual environment...
call ping-checker-venv\Scripts\activate.bat

echo Installing backend requirements...
pip install -r requirements.txt

cd frontend

echo Checking node_modules...
if not exist node_modules (
    echo Installing frontend dependencies...
    cmd /c "npm install --no-progress --no-audit" && echo Dependencies installed successfully
) else (
    echo Updating frontend dependencies...
    cmd /c "npm update" && echo Dependencies updated successfully
)

echo Checking dist folder...
if not exist dist (
    echo Building frontend...
    cmd /c "npm run build" && echo Frontend built successfully
)

cd ..

echo Starting backend...
cd utils
start /b py autostart.py

echo Everything is done. Keeping terminal open...
cmd /k
