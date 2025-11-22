from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.db.session import get_db
from app.core.security import get_current_active_user

router = APIRouter()

@router.post("/", response_model=schemas.Msg, status_code=status.HTTP_201_CREATED)
def create_review(
    review: schemas.ReviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Create a review for a completed request"""
    # Check if request exists
    request = db.query(models.Request).filter(models.Request.id == review.request_id).first()
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
        
    # Check if user is the owner of the request
    if request.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    # Check if request is completed
    if request.status != models.RequestStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Request must be completed to leave a review")
        
    # Check if review already exists
    existing_review = db.query(models.Review).filter(models.Review.request_id == review.request_id).first()
    if existing_review:
        raise HTTPException(status_code=400, detail="Review already exists for this request")
        
    # Create review
    db_review = models.Review(
        rating=review.rating,
        comment=review.comment,
        request_id=review.request_id,
        provider_id=request.provider_id,
        user_id=current_user.id
    )
    db.add(db_review)
    
    # Update provider rating
    provider = db.query(models.Provider).filter(models.Provider.id == request.provider_id).first()
    if provider:
        # Recalculate average rating
        # Note: This is a simple implementation. For high load, consider caching or background jobs.
        reviews_query = db.query(models.Review).filter(models.Review.provider_id == provider.id)
        total_rating = sum([r.rating for r in reviews_query.all()]) + review.rating
        count = reviews_query.count() + 1
        provider.rating = total_rating / count
        db.add(provider)
        
    db.commit()
    return {"msg": "Review created successfully"}
