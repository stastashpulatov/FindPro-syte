from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class NotificationBase(BaseModel):
    title: str
    message: str

class NotificationCreate(NotificationBase):
    user_id: int

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None

class Notification(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime

    class Config:
        orm_mode = True
