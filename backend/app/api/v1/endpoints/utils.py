from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import uuid
from typing import List
from app import schemas

router = APIRouter()

UPLOAD_DIR = "static/uploads"

@router.post("/upload", response_model=schemas.Msg)
async def upload_file(file: UploadFile = File(...)):
    """
    Upload a file and return its URL
    """
    # Create directory if it doesn't exist (it should, but just in case)
    if not os.path.exists(UPLOAD_DIR):
        os.makedirs(UPLOAD_DIR)
    
    # Generate unique filename
    file_ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{file_ext}"
    file_path = f"{UPLOAD_DIR}/{filename}"
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {str(e)}")
        
    # Return URL (relative to server root, assuming static mount at /static)
    # The frontend should prepend server URL if needed, or we return full path
    # For now, return relative path that can be used with static mount
    return {"msg": f"/static/uploads/{filename}"}
