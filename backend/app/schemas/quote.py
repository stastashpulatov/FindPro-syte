from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

class QuoteStatus(str, Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"

# Shared properties
class QuoteBase(BaseModel):
    request_id: int
    provider_id: int
    amount: float
    message: Optional[str] = None
    status: QuoteStatus = QuoteStatus.PENDING

# Properties to receive on quote creation
class QuoteCreate(QuoteBase):
    pass

# Properties to receive on quote update
class QuoteUpdate(BaseModel):
    amount: Optional[float] = None
    message: Optional[str] = None
    status: Optional[QuoteStatus] = None

# Properties shared by models stored in DB
class QuoteInDBBase(QuoteBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Properties to return to client
class Quote(QuoteInDBBase):
    pass

# Properties stored in DB
class QuoteInDB(QuoteInDBBase):
    pass
