#!/bin/bash

echo "🚀 Starting PlutoData Assignment..."

# Start backend
echo "📡 Starting backend server..."
cd backend
source venv/bin/activate
python setup_database.py
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend
echo "🎨 Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers are starting..."
echo "📡 Backend: http://localhost:8000"
echo "🎨 Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
