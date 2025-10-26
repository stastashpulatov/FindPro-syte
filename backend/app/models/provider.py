from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.base import Base

class Provider(Base):
    __tablename__ = "providers"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    company_name = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    service_area = Column(String, nullable=True)
    is_verified = Column(Boolean, default=False)
    rating = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User", back_populates="provider")
    services = relationship("ProviderService", back_populates="provider")
    quotes = relationship("Quote", back_populates="provider")
    
    def __repr__(self):
        return f"<Provider {self.company_name or self.user.email}>"
