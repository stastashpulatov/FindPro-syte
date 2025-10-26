from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, TYPE_CHECKING

if TYPE_CHECKING:
    from .service import Service

# Shared properties
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    icon: Optional[str] = None
    parent_id: Optional[int] = None

# Properties to receive on category creation
class CategoryCreate(CategoryBase):
    pass

# Properties to receive on category update
class CategoryUpdate(CategoryBase):
    name: Optional[str] = None

# Properties shared by models stored in DB
class CategoryInDBBase(CategoryBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Properties to return to client
class Category(CategoryInDBBase):
    subcategories: List['Category'] = []

# Properties stored in DB
class CategoryInDB(CategoryInDBBase):
    pass

# Handle forward references for subcategories
Category.model_rebuild()
