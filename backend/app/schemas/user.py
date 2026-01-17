from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    is_provider: bool = False

# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str
    is_active: bool = True
    is_superuser: bool = False
    is_provider: bool = False

# Properties to receive via API on update by Admin
class UserUpdate(UserBase):
    password: Optional[str] = None

# Properties to receive via API on self-update
class UserUpdateMe(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None

# Properties shared by models stored in DB
class UserInDBBase(UserBase):
    id: int
    email: EmailStr
    is_active: bool
    is_superuser: bool
    is_provider: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True

# Properties to return to client
class User(UserInDBBase):
    pass

# Properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str
