from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.db.session import get_db
from app.core.security import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Request])
def read_requests(
    skip: int = 0,
    limit: int = 100,
    status: Optional[schemas.RequestStatus] = None,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Retrieve requests with optional filtering by status and category"""
    query = db.query(models.Request)
    
    if status:
        query = query.filter(models.Request.status == status)
    if category_id:
        query = query.filter(models.Request.category_id == category_id)
    
    # Regular users can only see their own requests
    if not current_user.is_superuser:
        query = query.filter(models.Request.user_id == current_user.id)
    
    return query.offset(skip).limit(limit).all()

@router.post("/", response_model=schemas.Request, status_code=status.HTTP_201_CREATED)
def create_request(
    request: schemas.RequestCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Create a new service request"""
    # Check if category exists
    category = db.query(models.Category).filter(models.Category.id == request.category_id).first()
    if not category:
        raise HTTPException(status_code=400, detail="Invalid category ID")
    
    db_request = models.Request(
        **request.dict(),
        user_id=current_user.id
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.get("/{request_id}", response_model=schemas.Request)
def read_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Get a specific request by ID"""
    db_request = db.query(models.Request).filter(models.Request.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    # Check if user has permission to view this request
    if db_request.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return db_request

@router.put("/{request_id}", response_model=schemas.Request)
def update_request(
    request_id: int,
    request: schemas.RequestUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Update a service request"""
    db_request = db.query(models.Request).filter(models.Request.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    # Check if user has permission to update this request
    if db_request.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    update_data = request.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_request, field, value)
    
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

@router.delete("/{request_id}", response_model=schemas.Msg)
def delete_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Delete a service request"""
    db_request = db.query(models.Request).filter(models.Request.id == request_id).first()
    if not db_request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    # Check if user has permission to delete this request
    if db_request.user_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(db_request)
    db.commit()
    return {"msg": "Request deleted successfully"}
