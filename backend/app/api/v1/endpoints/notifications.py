from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.db.session import get_db
from app.core.security import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Notification])
def read_notifications(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """
    Retrieve notifications for current user
    """
    notifications = db.query(models.Notification)\
        .filter(models.Notification.user_id == current_user.id)\
        .order_by(models.Notification.created_at.desc())\
        .offset(skip).limit(limit).all()
    return notifications

@router.put("/{notification_id}/read", response_model=schemas.Notification)
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """
    Mark notification as read
    """
    notification = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
        
    if notification.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    notification.is_read = True
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification
