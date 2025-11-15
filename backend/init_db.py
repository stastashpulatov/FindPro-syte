#!/usr/bin/env python3
"""
Database initialization script
Creates all tables and optionally creates initial data
"""
from app.db.base import Base
from app.db.session import engine
from app import models

def init_db():
    """Initialize database by creating all tables"""
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()
