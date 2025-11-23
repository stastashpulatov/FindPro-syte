from fastapi import APIRouter
from .endpoints import auth, users, providers, categories, requests, quotes, reviews

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(providers.router, prefix="/providers", tags=["providers"])
api_router.include_router(categories.router, prefix="/categories", tags=["categories"])
api_router.include_router(requests.router, prefix="/requests", tags=["requests"])
api_router.include_router(quotes.router, prefix="/quotes", tags=["quotes"])
api_router.include_router(reviews.router, prefix="/reviews", tags=["reviews"])
