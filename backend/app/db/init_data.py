from sqlalchemy.orm import Session
from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models import User, Provider, Category, Request, Quote, ProviderService, Review
from app.core.security import get_password_hash

def init_db(db: Session) -> None:
    # Create tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

    # Create Admin
    admin_email = "admin@example.com"
    if not db.query(User).filter(User.email == admin_email).first():
        admin = User(
            email=admin_email,
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            is_active=True,
            is_superuser=True
        )
        db.add(admin)
        print("Admin user created")

    # Create Categories
    categories = [
        {
            "name": "IT-услуги",
            "description": "Разработка сайтов, приложений, настройка ПК",
            "icon": "💻"
        },
        {
            "name": "Ремонт и строительство",
            "description": "Ремонт квартир, сантехника, электрика",
            "icon": "🔨"
        },
        {
            "name": "Уборка и клининг",
            "description": "Уборка квартир, офисов, химчистка",
            "icon": "🧹"
        },
        {
            "name": "Репетиторы и обучение",
            "description": "Языки, школьные предметы, курсы",
            "icon": "📚"
        },
        {
            "name": "Красота и здоровье",
            "description": "Массаж, косметология, парикмахеры",
            "icon": "💅"
        },
        {
            "name": "Перевозки и курьеры",
            "description": "Грузоперевозки, доставка, переезды",
            "icon": "🚚"
        }
    ]

    for category_data in categories:
        category = db.query(Category).filter(Category.name == category_data["name"]).first()
        if not category:
            category = Category(**category_data)
            db.add(category)
    
    db.commit()
    print("Database initialized.")

def init() -> None:
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
