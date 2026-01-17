#!/bin/bash

# FindPro Complete Setup Script
# This script sets up the entire FindPro project from scratch

# set -e  # Exit on error - Disabled to allow partial setup

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print functions
print_header() {
    echo -e "\n${BLUE}============================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if Python is installed
check_python() {
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.8 or higher."
        exit 1
    fi
    print_success "Python 3 is installed: $(python3 --version)"
}


# Setup backend
setup_backend() {
    print_header "Setting up Backend"
    
    cd backend
    
    # Create virtual environment
    if [ ! -d ".venv" ]; then
        print_info "Creating virtual environment..."
        python3 -m venv .venv
        print_success "Virtual environment created"
    else
        print_info "Virtual environment already exists"
    fi
    
    # Activate virtual environment
    source .venv/bin/activate
    
    # Export flag for Python 3.14+ support (fixes pydantic-core build)
    export PYO3_USE_ABI3_FORWARD_COMPATIBILITY=1
    # Skip Cython compilation for Pydantic v1 (ensures pure python install on 3.14)
    export SKIP_CYTHON=1
    
    # Install dependencies
    print_info "Installing Python dependencies (this may take a while for Python 3.14)..."
    python3 -m pip install --upgrade pip
    if ! python3 -m pip install -v -r requirements.txt; then
        print_error "Failed to install dependencies. Please check your internet connection."
        exit 1
    fi
    print_success "Python dependencies installed"
    
    # Create .env if it doesn't exist
    if [ ! -f ".env" ]; then
        print_info "Creating .env file..."
        cat > .env << EOF
# Database
DATABASE_URL=sqlite:///./findpro.db

# Security
SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Environment
APP_ENV=development
EOF
        print_success ".env file created"
    else
        print_info ".env file already exists"
    fi
    
    # Initialize database
    print_info "Initializing database..."
    if ! python init_db.py; then
         print_error "Database initialization failed."
         exit 1
    fi
    
    # Create test users
    print_info "Creating test users..."
    python create_test_user.py
    
    # Seed categories
    print_info "Seeding categories..."
    python seed_categories.py <<< "n"
    
    cd ..
    print_success "Backend setup completed!"
}

# Setup frontendyt 
setup_frontend() {
    print_header "Setting up Frontend"
    
    # Install dependencies
    print_info "Installing npm dependencies..."
    npm install --silent
    print_success "npm dependencies installed"
    
    # Create .env if it doesn't exist
    if [ ! -f ".env" ]; then
        print_info "Creating frontend .env file..."
        cat > .env << EOF
REACT_APP_API_URL=http://localhost:8000/api/v1
EOF
        print_success "Frontend .env file created"
    else
        print_info "Frontend .env file already exists"
    fi
    
    print_success "Frontend setup completed!"
}

# Main setup
main() {
    print_header "FindPro Complete Setup"
    
    # Check prerequisites
    check_python
    # Setup backend
    setup_backend
    
    # Setup frontend (only if Node is present)
    if command -v node &> /dev/null; then
        setup_frontend
    else
        print_error "Node.js not found. Skipping frontend setup."
        print_info "Please install Node.js 16+ to run the frontend."
    fi
    
    # Final message
    print_header "Setup Complete!"
    
    echo -e "${GREEN}✓ FindPro is ready to use!${NC}\n"
    echo -e "To start the application:\n"
    echo -e "  ${YELLOW}Backend:${NC}"
    echo -e "    cd backend"
    echo -e "    source .venv/bin/activate"
    echo -e "    uvicorn main:app --reload --host 0.0.0.0 --port 8000\n"
    echo -e "  ${YELLOW}Frontend:${NC}"
    echo -e "    npm start\n"
    echo -e "  ${YELLOW}Or use the start script:${NC}"
    echo -e "    ./start.sh\n"
    echo -e "${BLUE}Login credentials:${NC}"
    echo -e "  User:  test@example.com / password123"
    echo -e "  Admin: admin@example.com / admin123\n"
    echo -e "${BLUE}API Documentation:${NC}"
    echo -e "  http://localhost:8000/docs\n"
}

# Run main function
main
