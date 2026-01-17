import sys
from sqlalchemy import inspect
from app.db.session import engine
from app.db.base import Base
from app.models import User, Provider, Category, Request, Quote, ProviderService, Review

def init_db():
    """Initialize database tables"""
    try:
        print("=" * 60)
        print("FindPro Database Initialization")
        print("=" * 60)
        
        # Import all models to ensure they're registered
        print("\n✓ Models imported successfully")
        print(f"  - User")
        print(f"  - Provider")
        print(f"  - Category")
        print(f"  - Request")
        print(f"  - Quote")
        print(f"  - ProviderService")
        print(f"  - Review")
        
        # Create all tables
        print("\n⚙ Creating database tables...")
        Base.metadata.create_all(bind=engine)
        
        # Verify tables were created
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        print("\n✓ Database tables created successfully!")
        print(f"\nCreated {len(tables)} tables:")
        for table in sorted(tables):
            print(f"  - {table}")
        
        print("\n" + "=" * 60)
        print("Database initialization completed successfully!")
        print("=" * 60)
        print("\nNext steps:")
        print("  1. Run: python create_test_user.py")
        print("  2. Run: python seed_categories.py")
        print("  3. Start backend: uvicorn main:app --reload")
        print("=" * 60)
        
        return True
        
    except Exception as e:
        print("\n" + "=" * 60)
        print("❌ ERROR: Database initialization failed!")
        print("=" * 60)
        print(f"\nError details: {str(e)}")
        print("\nPlease check:")
        print("  1. Database connection settings in .env")
        print("  2. All model files are properly imported")
        print("  3. SQLAlchemy is installed: pip install sqlalchemy")
        print("=" * 60)
        sys.exit(1)

if __name__ == "__main__":
    init_db()
