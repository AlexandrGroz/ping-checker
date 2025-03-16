#!/bin/bash

echo "Checking virtual environment..."
if [ ! -d "ping-checker-venv" ]; then
    echo "Virtual environment not found. Creating new one..."
    python3 -m venv ping-checker-venv
fi

echo "Activating virtual environment..."
source ping-checker-venv/bin/activate

echo "Installing backend requirements..."
pip install -r requirements.txt

cd frontend

echo "Checking node_modules..."
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install --no-progress --no-audit && echo "Dependencies installed successfully"
else
    echo "Updating frontend dependencies..."
    npm update && echo "Dependencies updated successfully"
fi

echo "Checking dist folder..."
if [ ! -d "dist" ]; then
    echo "Building frontend..."
    npm run build && echo "Frontend built successfully"
fi

cd ..

echo "Starting backend..."
cd utils
nohup python3 autostart.py &

echo "Everything is done. Terminal will stay open."