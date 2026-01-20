#!/bin/bash

# FindPro Start Script

echo "🚀 Starting FindPro..."
echo ""

# Add local node to PATH
if [ -d "node_dist/bin" ]; then
    export PATH="$PWD/node_dist/bin:$PATH"
    echo "✅ Using local Node.js from node_dist"
fi

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to check if a port is in use and kill the process
check_port() {
    local port=$1
    local pid=$(lsof -ti :$port)
    if [ ! -z "$pid" ]; then
        echo -e "${RED}⚠️  Port $port is in use by PID $pid. Killing process...${NC}"
        kill -9 $pid
    fi
}

# Setup/Check Backend
echo -e "${BLUE}📦 Checking Backend...${NC}"
cd backend

# Create venv if missing or broken
if [ ! -f ".venv/bin/activate" ]; then
    echo -e "${RED}❌ Virtual environment missing or broken. Running setup...${NC}"
    rm -rf .venv
    cd ..
    ./setup.sh
    cd backend
fi

source .venv/bin/activate

# Export flag for Python 3.14+ support
export PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1
export SKIP_CYTHON=1

# Check dependencies
if ! python -c "import fastapi" &> /dev/null; then
    echo -e "${RED}❌ Dependencies missing. Installing...${NC}"
    if ! python -m pip install -r requirements.txt; then
        echo -e "${RED}❌ Failed to install dependencies. Exiting.${NC}"
        exit 1
    fi
fi

# Initialize DB if missing
if [ ! -f "findpro.db" ]; then
    echo -e "${BLUE}🗄️  Initializing database...${NC}"
    python init_db.py
    python seed_categories.py
    python create_test_user.py
fi

# Clear ports
check_port 8000
check_port 3000

echo -e "${GREEN}✅ Backend starting on http://localhost:8000${NC}"
echo -e "${GREEN}📚 Docs: http://localhost:8000/docs${NC}"
echo ""

# Start backend in background
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to start..."
sleep 5

cd ..

# Start Frontend if available
if command -v npm &> /dev/null; then
    echo -e "${BLUE}🎨 Starting Frontend...${NC}"
    echo -e "${GREEN}✅ Frontend starting on http://localhost:3000${NC}"
    echo ""
    echo -e "${GREEN}🎉 Application is running!${NC}"
    echo ""
    echo -e "${BLUE}Test Users:${NC}"
    echo "  👤 User: test@example.com / password123"
    echo "  👨‍💼 Admin: admin@example.com / admin123"
    echo ""
    echo -e "${RED}Press Ctrl+C to stop${NC}"
    echo ""

    # Start frontend
    npm start
else
    echo -e "${YELLOW}⚠️  Node.js not found. Frontend will not start.${NC}"
    echo -e "${GREEN}✅ Backend is running on http://localhost:8000${NC}"
    echo ""
    echo -e "${RED}Press Ctrl+C to stop${NC}"
    
    # Wait indefinitely so backend keeps running
    wait $BACKEND_PID
fi

# Cleanup on exit
kill $BACKEND_PID
