from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Shared properties
class ServiceBase(BaseModel):
    provider_id: int
    category_id: int
    title: str
    description: Optional[str] = None
    price: float
    price_unit: str = "hour"
    is_available: bool = True

# Properties to receive on service creation
class ServiceCreate(ServiceBase):
    pass

# Properties to receive on service update
class ServiceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    price_unit: Optional[str] = None
    is_available: Optional[bool] = None

# Properties shared by models stored in DB
class ServiceInDBBase(ServiceBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Properties to return to client
class Service(ServiceInDBBase):
    pass

# Properties stored in DB
class ServiceInDB(ServiceInDBBase):
    pass
