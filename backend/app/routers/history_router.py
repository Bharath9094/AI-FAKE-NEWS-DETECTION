from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.db_models import ScanHistory, User
from ..utils.auth import get_current_user_optional

router = APIRouter(prefix="", tags=["History & Bookmarks"])

@router.get("/history")
def get_history(
    bookmarked_only: bool = False,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    query = db.query(ScanHistory)
    if current_user:
        query = query.filter(ScanHistory.user_id == current_user.id)
    if bookmarked_only:
        query = query.filter(ScanHistory.is_bookmarked == True)

    results = query.order_by(ScanHistory.created_at.desc()).limit(limit).all()
    return results

@router.post("/history/{scan_id}/bookmark")
def toggle_bookmark(scan_id: int, db: Session = Depends(get_db)):
    scan = db.query(ScanHistory).filter(ScanHistory.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found")
    
    scan.is_bookmarked = not scan.is_bookmarked
    db.commit()
    return {"id": scan.id, "is_bookmarked": scan.is_bookmarked}

@router.delete("/history/{scan_id}")
def delete_scan(scan_id: int, db: Session = Depends(get_db)):
    scan = db.query(ScanHistory).filter(ScanHistory.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan record not found")
    
    db.delete(scan)
    db.commit()
    return {"message": "Scan deleted successfully"}
