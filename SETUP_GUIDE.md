# FindPro Setup Guide

Complete guide for setting up and running the FindPro project.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16+** - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/)

## Quick Start

### Automated Setup (Recommended)

The easiest way to set up the project:

```bash
# Clone the repository
git clone <repository-url>
cd FindPro-syte

# Run the setup script
chmod +x setup.sh
./setup.sh
```

This script will:
- ✅ Check prerequisites
- ✅ Set up Python virtual environment
- ✅ Install all dependencies
- ✅ Initialize the database
- ✅ Create test users
- ✅ Seed categories
- ✅ Configure environment files

### Manual Setup

If you prefer to set up manually:

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv .venv

# Activate virtual environment
source .venv/bin/activate  # On Linux/Mac
# or
.venv\Scripts\activate  # On Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and set your SECRET_KEY
# Generate with: python -c 'import secrets; print(secrets.token_urlsafe(32))'

# Initialize database
python init_db.py

# Create test users
python create_test_user.py

# Seed categories
python seed_categories.py

# Return to project root
cd ..
```

#### 2. Frontend Setup

```bash
# Install npm dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env if needed (default should work for local development)
```

## Running the Application

### Development Mode

You have two options:

#### Option 1: Using the start script (Recommended)

```bash
./start.sh
```

This will start both backend and frontend automatically.

#### Option 2: Manual start

**Terminal 1 - Backend:**
```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 - Frontend:**
```bash
npm start
```

### Access the Application

Once running, you can access:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Admin Panel**: http://localhost:8000/admin

### Test Credentials

```
Regular User:
  Email: test@example.com
  Password: password123

Admin User:
  Email: admin@example.com
  Password: admin123
```

## Project Structure

```
FindPro-syte/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Configuration & security
│   │   ├── db/          # Database setup
│   │   ├── models/      # SQLAlchemy models
│   │   └── schemas/     # Pydantic schemas
│   ├── init_db.py       # Database initialization
│   ├── create_test_user.py  # Test user creation
│   ├── seed_categories.py   # Category seeding
│   └── requirements.txt
├── src/                 # React frontend
│   ├── components/      # React components
│   ├── pages/          # Page components
│   └── services/       # API services
├── setup.sh            # Automated setup script
├── start.sh            # Start script
└── README.md
```

## Common Tasks

### Reset Database

```bash
cd backend
rm findpro.db  # Delete existing database
python init_db.py
python create_test_user.py
python seed_categories.py
```

### Add New Category

```bash
cd backend
source .venv/bin/activate
python seed_categories.py
```

### Create Admin User

```bash
cd backend
source .venv/bin/activate
python create_admin.py
```

## Troubleshooting

### Backend won't start

**Problem**: `ModuleNotFoundError` or import errors

**Solution**:
```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
```

### Database errors

**Problem**: Database tables don't exist

**Solution**:
```bash
cd backend
python init_db.py
```

### Frontend can't connect to backend

**Problem**: CORS errors or connection refused

**Solution**:
1. Ensure backend is running on port 8000
2. Check `.env` file has correct `REACT_APP_API_URL`
3. Verify CORS settings in `backend/app/core/config.py`

### Port already in use

**Problem**: Port 8000 or 3000 is already in use

**Solution**:
```bash
# Find process using port
lsof -i :8000  # or :3000

# Kill the process
kill -9 <PID>
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL=sqlite:///./findpro.db
SECRET_KEY=<your-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
APP_ENV=development
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:8000/api/v1
```

## Production Deployment

For production deployment:

1. **Use PostgreSQL** instead of SQLite
2. **Set strong SECRET_KEY** in backend/.env
3. **Configure ALLOWED_ORIGINS** in config.py
4. **Set APP_ENV=production**
5. **Use proper web server** (nginx + gunicorn)
6. **Enable HTTPS**

See `DEPLOYMENT.md` for detailed production setup instructions.

## Getting Help

- Check the [README.md](README.md) for overview
- Review [API Documentation](http://localhost:8000/docs) when backend is running
- Check existing issues in the repository
- Contact the development team

## Next Steps

After setup:

1. ✅ Explore the API documentation at `/docs`
2. ✅ Try creating a service request
3. ✅ Register as a provider
4. ✅ Test the quote system
5. ✅ Access the admin panel

Happy coding! 🚀
