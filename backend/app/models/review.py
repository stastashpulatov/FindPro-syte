from sqlalchemy import Column, Integer, String, Text, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..db.base import Base

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(Integer, primary_key=True, index=True)
    rating = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(Text, nullable=True)
    request_id = Column(Integer, ForeignKey("requests.id"), unique=True)
    provider_id = Column(Integer, ForeignKey("providers.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    request = relationship("Request")
    provider = relationship("Provider")
    author = relationship("User", back_populates="reviews")
    
    def __repr__(self):
        return f"<Review {self.rating} stars>"
