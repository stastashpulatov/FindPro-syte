import sys
import os
from pathlib import Path

# Add backend directory to python path
backend_dir = Path(__file__).parent
sys.path.append(str(backend_dir))

from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash

def create_superuser(email, password, full_name):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.email == email).first()
        if user:
            print(f"User {email} already exists")
            return
        
        db_user = User(
            email=email,
            hashed_password=get_password_hash(password),
            full_name=full_name,
            is_active=True,
            is_superuser=True
        )
        db.add(db_user)
        db.commit()
        print(f"Superuser {email} created successfully")
    except Exception as e:
        print(f"Error creating superuser: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python create_admin.py <email> <password> [full_name]")
        sys.exit(1)
    
    email = sys.argv[1]
    password = sys.argv[2]
    full_name = sys.argv[3] if len(sys.argv) > 3 else "Admin"
    
    create_superuser(email, password, full_name)
