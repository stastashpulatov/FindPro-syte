from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.db.session import get_db
from app.core.security import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Provider])
def read_providers(
    skip: int = 0,
    limit: int = 100,
    is_verified: Optional[bool] = None,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Retrieve providers with optional filtering"""
    query = db.query(models.Provider)
    
    if is_verified is not None:
        query = query.filter(models.Provider.is_verified == is_verified)
    
    if category_id:
        query = query.join(models.ProviderService).filter(
            models.ProviderService.category_id == category_id
        )
    
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=schemas.Provider, status_code=status.HTTP_201_CREATED)
def create_provider(
    provider: schemas.ProviderCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Create a new provider profile"""
    # Check if user already has a provider profile
    if current_user.provider:
        raise HTTPException(status_code=400, detail="User already has a provider profile")
    
    # Only allow users to create their own provider profile
    if provider.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Can only create provider profile for yourself")
    
    # Check if user exists
    db_user = db.query(models.User).filter(models.User.id == provider.user_id).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")
    
    db_provider = models.Provider(**provider.dict())
    db.add(db_provider)
    db.commit()
    db.refresh(db_provider)
    return db_provider

@router.get("/me", response_model=schemas.Provider)
def read_my_provider(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Get the current user's provider profile"""
    if not current_user.provider:
        raise HTTPException(status_code=404, detail="Provider profile not found")
    return current_user.provider

@router.get("/{provider_id}", response_model=schemas.Provider)
def read_provider(
    provider_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Get a specific provider by ID"""
    db_provider = db.query(models.Provider).filter(models.Provider.id == provider_id).first()
    if not db_provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    return db_provider

@router.put("/{provider_id}", response_model=schemas.Provider)
def update_provider(
    provider_id: int,
    provider: schemas.ProviderUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Update a provider profile"""
    db_provider = db.query(models.Provider).filter(models.Provider.id == provider_id).first()
    if not db_provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    # Check permissions
    if db_provider.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = provider.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_provider, field, value)
    
    db.add(db_provider)
    db.commit()
    db.refresh(db_provider)
    return db_provider

@router.delete("/{provider_id}", response_model=schemas.Msg)
def delete_provider(
    provider_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Delete a provider profile"""
    db_provider = db.query(models.Provider).filter(models.Provider.id == provider_id).first()
    if not db_provider:
        raise HTTPException(status_code=404, detail="Provider not found")
    
    # Check permissions
    if db_provider.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(db_provider)
    db.commit()
    return {"msg": "Provider profile deleted successfully"}
