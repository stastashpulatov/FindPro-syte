from sqlalchemy import Column, Integer, Float, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.base import Base
import enum

class QuoteStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    REJECTED = "rejected"
    EXPIRED = "expired"

class Quote(Base):
    __tablename__ = "quotes"
    
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("requests.id"))
    provider_id = Column(Integer, ForeignKey("providers.id"))
    amount = Column(Float, nullable=False)
    message = Column(Text, nullable=True)
    status = Column(Enum(QuoteStatus), default=QuoteStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    request = relationship("Request", back_populates="quotes")
    provider = relationship("Provider", back_populates="quotes")
    
    def __repr__(self):
        return f"<Quote {self.id} - {self.amount}>"
