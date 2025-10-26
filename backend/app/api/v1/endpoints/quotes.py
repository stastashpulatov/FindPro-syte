from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.db.session import get_db
from app.core.security import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Quote])
def read_quotes(
    skip: int = 0,
    limit: int = 100,
    request_id: Optional[int] = None,
    provider_id: Optional[int] = None,
    status: Optional[schemas.QuoteStatus] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Retrieve quotes with optional filtering"""
    query = db.query(models.Quote)
    
    if request_id:
        query = query.filter(models.Quote.request_id == request_id)
    if provider_id:
        query = query.filter(models.Quote.provider_id == provider_id)
    if status:
        query = query.filter(models.Quote.status == status)
    
    # Regular users can only see quotes for their own requests
    if not current_user.is_superuser and not current_user.provider:
        query = query.join(models.Request).filter(models.Request.user_id == current_user.id)
    # Providers can only see their own quotes
    elif current_user.provider and not current_user.is_superuser:
        query = query.filter(models.Quote.provider_id == current_user.provider.id)
    
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=schemas.Quote, status_code=status.HTTP_201_CREATED)
def create_quote(
    quote: schemas.QuoteCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Create a new quote"""
    # Check if the current user is a provider
    if not current_user.provider and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only providers can create quotes")
    
    # Check if request exists
    db_request = db.query(models.Request).filter(models.Request.id == quote.request_id).first()
    if not db_request:
        raise HTTPException(status_code=400, detail="Invalid request ID")
    
    # Check if provider exists
    db_provider = db.query(models.Provider).filter(models.Provider.id == quote.provider_id).first()
    if not db_provider:
        raise HTTPException(status_code=400, detail="Invalid provider ID")
    
    # Ensure providers can only create quotes for themselves
    if current_user.provider and current_user.provider.id != quote.provider_id:
        raise HTTPException(status_code=403, detail="Can only create quotes for your own provider account")
    
    # Check if quote already exists for this request and provider
    existing_quote = db.query(models.Quote).filter(
        models.Quote.request_id == quote.request_id,
        models.Quote.provider_id == quote.provider_id
    ).first()
    
    if existing_quote:
        raise HTTPException(status_code=400, detail="Quote already exists for this request and provider")
    
    db_quote = models.Quote(**quote.dict())
    db.add(db_quote)
    db.commit()
    db.refresh(db_quote)
    return db_quote

@router.get("/{quote_id}", response_model=schemas.Quote)
def read_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Get a specific quote by ID"""
    db_quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not db_quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    
    # Check permissions
    if not current_user.is_superuser:
        # Request owner or quote provider can view
        if db_quote.request.user_id != current_user.id and \
           (not current_user.provider or db_quote.provider_id != current_user.provider.id):
            raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return db_quote

@router.put("/{quote_id}", response_model=schemas.Quote)
def update_quote(
    quote_id: int,
    quote: schemas.QuoteUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Update a quote"""
    db_quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not db_quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    
    # Check permissions
    if not current_user.is_superuser:
        # Only the provider who created the quote can update it
        if not current_user.provider or db_quote.provider_id != current_user.provider.id:
            raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = quote.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_quote, field, value)
    
    db.add(db_quote)
    db.commit()
    db.refresh(db_quote)
    return db_quote

@router.post("/{quote_id}/accept", response_model=schemas.Quote)
def accept_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Accept a quote (only the request owner can do this)"""
    db_quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not db_quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    
    # Check if the current user is the request owner
    if db_quote.request.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only the request owner can accept quotes")
    
    # Update quote status
    db_quote.status = schemas.QuoteStatus.ACCEPTED
    
    # Update request status
    db_quote.request.status = schemas.RequestStatus.IN_PROGRESS
    
    # Reject all other quotes for this request
    db.query(models.Quote).filter(
        models.Quote.request_id == db_quote.request_id,
        models.Quote.id != db_quote.id,
        models.Quote.status == schemas.QuoteStatus.PENDING
    ).update({"status": schemas.QuoteStatus.REJECTED})
    
    db.add(db_quote)
    db.commit()
    db.refresh(db_quote)
    return db_quote

@router.post("/{quote_id}/reject", response_model=schemas.Quote)
def reject_quote(
    quote_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Reject a quote (only the request owner can do this)"""
    db_quote = db.query(models.Quote).filter(models.Quote.id == quote_id).first()
    if not db_quote:
        raise HTTPException(status_code=404, detail="Quote not found")
    
    # Check if the current user is the request owner
    if db_quote.request.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Only the request owner can reject quotes")
    
    # Update quote status
    db_quote.status = schemas.QuoteStatus.REJECTED
    
    db.add(db_quote)
    db.commit()
    db.refresh(db_quote)
    return db_quote
