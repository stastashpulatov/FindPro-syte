from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from enum import Enum
import json
from pydantic import BaseModel, validator

class RequestStatus(str, Enum):
    PENDING = "pending"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

# Shared properties
class RequestBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: RequestStatus = RequestStatus.PENDING
    category_id: int
    provider_id: Optional[int] = None
    price: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    photos: Optional[List[str]] = []

# Properties to receive on request creation
class RequestCreate(RequestBase):
    pass

# Properties to receive on request update
class RequestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[RequestStatus] = None
    category_id: Optional[int] = None
    provider_id: Optional[int] = None
    price: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    photos: Optional[List[str]] = None
    completed_at: Optional[datetime] = None

# Properties shared by models stored in DB
class RequestInDBBase(RequestBase):
    id: int
    user_id: int
    provider_id: Optional[int] = None
    price: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    photos: Optional[List[str]] = []
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        orm_mode = True

# Properties to return to client
class Request(RequestInDBBase):
    @validator('photos', pre=True, check_fields=False)
    def parse_photos(cls, v):
        if isinstance(v, str):
            try:
                return json.loads(v)
            except json.JSONDecodeError:
                return []
        return v
    
    class Config:
        orm_mode = True

# Properties stored in DB
class RequestInDB(RequestInDBBase):
    pass
