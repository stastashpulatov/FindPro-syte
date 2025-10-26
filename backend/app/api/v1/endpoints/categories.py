from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.db.session import get_db
from app.core.security import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Category])
def read_categories(
    skip: int = 0,
    limit: int = 100,
    parent_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Retrieve categories with optional parent filtering"""
    query = db.query(models.Category)
    
    if parent_id is not None:
        query = query.filter(models.Category.parent_id == parent_id)
    else:
        # If no parent_id is provided, return only root categories by default
        query = query.filter(models.Category.parent_id.is_(None))
    
    categories = query.offset(skip).limit(limit).all()
    return categories

@router.post("/", response_model=schemas.Category, status_code=status.HTTP_201_CREATED)
def create_category(
    category: schemas.CategoryCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Create a new category (admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Check if parent category exists if parent_id is provided
    if category.parent_id is not None:
        parent = db.query(models.Category).filter(models.Category.id == category.parent_id).first()
        if not parent:
            raise HTTPException(status_code=400, detail="Parent category not found")
    
    # Check if category with same name already exists
    existing_category = db.query(models.Category).filter(
        models.Category.name == category.name,
        models.Category.parent_id == category.parent_id
    ).first()
    
    if existing_category:
        raise HTTPException(status_code=400, detail="Category with this name already exists in this parent")
    
    db_category = models.Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.get("/{category_id}", response_model=schemas.Category)
def read_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific category by ID"""
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    return db_category

@router.put("/{category_id}", response_model=schemas.Category)
def update_category(
    category_id: int,
    category: schemas.CategoryUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Update a category (admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category.dict(exclude_unset=True)
    
    # Check if parent category is being updated and if it would create a cycle
    if 'parent_id' in update_data and update_data['parent_id'] is not None:
        if update_data['parent_id'] == category_id:
            raise HTTPException(status_code=400, detail="Category cannot be its own parent")
        
        # Check if the new parent exists
        new_parent = db.query(models.Category).filter(
            models.Category.id == update_data['parent_id']
        ).first()
        
        if not new_parent:
            raise HTTPException(status_code=400, detail="Parent category not found")
        
        # Check for cycles in the category hierarchy
        current_parent_id = update_data['parent_id']
        while current_parent_id is not None:
            if current_parent_id == category_id:
                raise HTTPException(status_code=400, detail="This would create a cycle in the category hierarchy")
            current_parent = db.query(models.Category).filter(
                models.Category.id == current_parent_id
            ).first()
            current_parent_id = current_parent.parent_id if current_parent else None
    
    # Check if category with same name already exists under the same parent
    if 'name' in update_data:
        existing_category = db.query(models.Category).filter(
            models.Category.name == update_data['name'],
            models.Category.parent_id == (update_data.get('parent_id') or db_category.parent_id),
            models.Category.id != category_id
        ).first()
        
        if existing_category:
            raise HTTPException(status_code=400, detail="Category with this name already exists in this parent")
    
    for field, value in update_data.items():
        setattr(db_category, field, value)
    
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

@router.delete("/{category_id}", response_model=schemas.Msg)
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Delete a category (admin only)"""
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_category = db.query(models.Category).filter(models.Category.id == category_id).first()
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    # Check if category has subcategories
    subcategories = db.query(models.Category).filter(
        models.Category.parent_id == category_id
    ).count()
    
    if subcategories > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete category with subcategories. Please delete or move the subcategories first."
        )
    
    # Check if category is being used by any services
    service_count = db.query(models.ProviderService).filter(
        models.ProviderService.category_id == category_id
    ).count()
    
    if service_count > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete category that is being used by services"
        )
    
    # Check if category is being used by any requests
    request_count = db.query(models.Request).filter(
        models.Request.category_id == category_id
    ).count()
    
    if request_count > 0:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete category that is being used by requests"
        )
    
    db.delete(db_category)
    db.commit()
    return {"msg": "Category deleted successfully"}
