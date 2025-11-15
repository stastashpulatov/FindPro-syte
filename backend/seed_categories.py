#!/usr/bin/env python3
"""
Seed initial categories into the database
"""
from app.db.session import SessionLocal
from app.models.category import Category

def seed_categories():
    db = SessionLocal()
    try:
        # Check if categories already exist
        existing_count = db.query(Category).count()
        if existing_count > 0:
            print(f"Categories already exist ({existing_count}). Skipping seed.")
            return

        categories = [
            {"name": "Строительство", "description": "Строительные работы любой сложности", "icon": "🏗️"},
            {"name": "Ремонт", "description": "Ремонт квартир и домов", "icon": "🔧"},
            {"name": "Сантехника", "description": "Сантехнические услуги", "icon": "🚰"},
            {"name": "Электрика", "description": "Электромонтажные работы", "icon": "⚡"},
            {"name": "Уборка", "description": "Клининговые услуги", "icon": "🧹"},
            {"name": "Ландшафт", "description": "Ландшафтный дизайн", "icon": "🌳"},
            {"name": "IT-услуги", "description": "Компьютерная помощь", "icon": "💻"},
            {"name": "Перевозки", "description": "Грузоперевозки", "icon": "🚚"},
        ]

        print("Seeding categories...")
        for cat_data in categories:
            category = Category(**cat_data)
            db.add(category)
        
        db.commit()
        print(f"Successfully seeded {len(categories)} categories!")

    except Exception as e:
        print(f"Error seeding categories: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_categories()
