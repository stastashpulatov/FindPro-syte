from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

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

# Properties to receive on request creation
class RequestCreate(RequestBase):
    pass

# Properties to receive on request update
class RequestUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[RequestStatus] = None
    category_id: Optional[int] = None

# Properties shared by models stored in DB
class RequestInDBBase(RequestBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Properties to return to client
class Request(RequestInDBBase):
    pass

# Properties stored in DB
class RequestInDB(RequestInDBBase):
    pass
