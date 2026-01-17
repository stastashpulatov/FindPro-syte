"""
Database seeding script for categories
Populates the database with default service categories
"""
import sys
from sqlalchemy.orm import Session
from app.db.session import engine, SessionLocal
from app.models import Category

# Default categories for the platform
DEFAULT_CATEGORIES = [
    {
        "name": "Строительство",
        "description": "Строительные работы любой сложности",
        "icon": "🏗️"
    },
    {
        "name": "Ремонт",
        "description": "Ремонт квартир и домов",
        "icon": "🔧"
    },
    {
        "name": "Сантехника",
        "description": "Сантехнические услуги",
        "icon": "🚰"
    },
    {
        "name": "Электрика",
        "description": "Электромонтажные работы",
        "icon": "⚡"
    },
    {
        "name": "Уборка",
        "description": "Клининговые услуги",
        "icon": "🧹"
    },
    {
        "name": "Ландшафт",
        "description": "Ландшафтный дизайн и озеленение",
        "icon": "🌳"
    },
    {
        "name": "IT-услуги",
        "description": "Компьютерная помощь и настройка",
        "icon": "💻"
    },
    {
        "name": "Перевозки",
        "description": "Грузоперевозки и переезды",
        "icon": "🚚"
    },
    {
        "name": "Дизайн",
        "description": "Дизайн интерьера и экстерьера",
        "icon": "🎨"
    },
    {
        "name": "Юридические услуги",
        "description": "Юридическая консультация и помощь",
        "icon": "⚖️"
    }
]

def seed_categories():
    """Seed the database with default categories"""
    db = SessionLocal()
    
    try:
        print("=" * 60)
        print("FindPro Categories Seeding")
        print("=" * 60)
        
        # Check if categories already exist
        existing_count = db.query(Category).count()
        
        if existing_count > 0:
            print(f"\n⚠ Found {existing_count} existing categories")
            response = input("Do you want to skip seeding? (y/n): ").lower()
            if response == 'y':
                print("\n✓ Skipping category seeding")
                return
        
        print(f"\n⚙ Adding {len(DEFAULT_CATEGORIES)} categories...")
        
        added = 0
        skipped = 0
        
        for cat_data in DEFAULT_CATEGORIES:
            # Check if category already exists
            existing = db.query(Category).filter(
                Category.name == cat_data["name"]
            ).first()
            
            if existing:
                print(f"  ⊘ Skipped: {cat_data['name']} (already exists)")
                skipped += 1
            else:
                category = Category(**cat_data)
                db.add(category)
                print(f"  ✓ Added: {cat_data['name']}")
                added += 1
        
        db.commit()
        
        print("\n" + "=" * 60)
        print("Category seeding completed!")
        print("=" * 60)
        print(f"\nResults:")
        print(f"  - Added: {added} categories")
        print(f"  - Skipped: {skipped} categories")
        print(f"  - Total in DB: {db.query(Category).count()} categories")
        print("=" * 60)
        
    except Exception as e:
        db.rollback()
        print("\n" + "=" * 60)
        print("❌ ERROR: Category seeding failed!")
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
    seed_categories()
