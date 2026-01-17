from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Shared properties
class ReviewBase(BaseModel):
    rating: int
    comment: Optional[str] = None
    request_id: int

# Properties to receive on review creation
class ReviewCreate(ReviewBase):
    pass

# Properties shared by models stored in DB
class ReviewInDBBase(ReviewBase):
    id: int
    provider_id: int
    user_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Properties to return to client
class Review(ReviewInDBBase):
    pass
