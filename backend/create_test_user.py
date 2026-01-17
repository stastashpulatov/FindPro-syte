"""
Script to create test users for development
"""
import sys
from app.db.session import SessionLocal
from app.models import User
from app.core.security import get_password_hash

def create_test_users():
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("FindPro Test Users Creation")
        print("=" * 60)
        
        created = 0
        skipped = 0
        
        # Create test user
        test_user = db.query(User).filter(User.email == "test@example.com").first()
        if not test_user:
            test_user = User(
                email="test@example.com",
                hashed_password=get_password_hash("password123"),
                full_name="Test User",
                is_active=True,
                is_superuser=False
            )
            db.add(test_user)
            print("\n✓ Created test user: test@example.com")
            created += 1
        else:
            print("\n⊘ Test user already exists: test@example.com")
            skipped += 1
        
        # Create admin user
        admin_user = db.query(User).filter(User.email == "admin@example.com").first()
        if not admin_user:
            admin_user = User(
                email="admin@example.com",
                hashed_password=get_password_hash("admin123"),
                full_name="Admin User",
                is_active=True,
                is_superuser=True
            )
            db.add(admin_user)
            print("✓ Created admin user: admin@example.com")
            created += 1
        else:
            print("⊘ Admin user already exists: admin@example.com")
            skipped += 1
        
        db.commit()
        
        print("\n" + "=" * 60)
        print("Test users creation completed!")
        print("=" * 60)
        print(f"\nResults:")
        print(f"  - Created: {created} users")
        print(f"  - Skipped: {skipped} users")
        print(f"\n📝 Login credentials:")
        print(f"  User:  test@example.com / password123")
        print(f"  Admin: admin@example.com / admin123")
        print("=" * 60)
        
    except Exception as e:
        db.rollback()
        print("\n" + "=" * 60)
        print("❌ ERROR: Test user creation failed!")
        print("=" * 60)
        print(f"\nError details: {str(e)}")
        print("\nPlease check:")
        print("  1. Database is initialized: python init_db.py")
        print("  2. Database connection is working")
        print("=" * 60)
        sys.exit(1)
        
    finally:
        db.close()

if __name__ == "__main__":
    create_test_users()
