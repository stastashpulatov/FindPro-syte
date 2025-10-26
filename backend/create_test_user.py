"""
Script to create a test user for development
"""
from app.db.session import SessionLocal
from app.models import User, Category
from app.core.security import get_password_hash

def create_test_data():
    db = SessionLocal()
    
    try:
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
            print("✅ Created test user: test@example.com / password123")
        else:
            print("ℹ️  Test user already exists")
        
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
            print("✅ Created admin user: admin@example.com / admin123")
        else:
            print("ℹ️  Admin user already exists")
        
        # Create categories
        categories_data = [
            {"name": "Строительство", "description": "Строительные работы любой сложности", "icon": "🏗️"},
            {"name": "Ремонт", "description": "Ремонт квартир и домов", "icon": "🔧"},
            {"name": "Сантехника", "description": "Сантехнические услуги", "icon": "🚰"},
            {"name": "Электрика", "description": "Электромонтажные работы", "icon": "⚡"},
            {"name": "Уборка", "description": "Клининговые услуги", "icon": "🧹"},
            {"name": "Ландшафт", "description": "Ландшафтный дизайн", "icon": "🌳"},
            {"name": "IT-услуги", "description": "Компьютерная помощь", "icon": "💻"},
            {"name": "Перевозки", "description": "Грузоперевозки", "icon": "🚚"},
        ]
        
        for cat_data in categories_data:
            existing_cat = db.query(Category).filter(Category.name == cat_data["name"]).first()
            if not existing_cat:
                category = Category(**cat_data)
                db.add(category)
                print(f"✅ Created category: {cat_data['name']}")
        
        db.commit()
        print("\n✅ Test data created successfully!")
        print("\n📝 You can now login with:")
        print("   User: test@example.com / password123")
        print("   Admin: admin@example.com / admin123")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_data()
