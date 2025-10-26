from fastapi import APIRouter
from .endpoints import auth, users, requests, quotes, providers, categories

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(requests.router, prefix="/requests", tags=["Requests"])
api_router.include_router(quotes.router, prefix="/quotes", tags=["Quotes"])
api_router.include_router(providers.router, prefix="/providers", tags=["Providers"])
api_router.include_router(categories.router, prefix="/categories", tags=["Categories"])
