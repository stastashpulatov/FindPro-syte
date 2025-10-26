from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from .user import User
from .service import Service

# Shared properties
class ProviderBase(BaseModel):
    company_name: Optional[str] = None
    description: Optional[str] = None
    service_area: Optional[str] = None
    is_verified: bool = False
    rating: int = 0

# Properties to receive on provider creation
class ProviderCreate(ProviderBase):
    user_id: int

# Properties to receive on provider update
class ProviderUpdate(ProviderBase):
    company_name: Optional[str] = None
    description: Optional[str] = None
    service_area: Optional[str] = None
    is_verified: Optional[bool] = None
    rating: Optional[int] = None

# Properties shared by models stored in DB
class ProviderInDBBase(ProviderBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Properties to return to client
class Provider(ProviderInDBBase):
    user: User
    services: List[Service] = []

# Properties stored in DB
class ProviderInDB(ProviderInDBBase):
    pass
