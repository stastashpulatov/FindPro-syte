from app.db.session import engine
from app.db.base import Base
from app.models import User, Provider, Category, Request, Quote, ProviderService

def init_db():
    """Initialize database tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
