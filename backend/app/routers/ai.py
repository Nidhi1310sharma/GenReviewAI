"""
Sentiment prediction (Module 5) and AI review drafting (Module 6).

Status: STUB — folder/routing wired up in Module 1 (project setup).
Real endpoints land in Module 5. Every route below is a
placeholder that proves the router is mounted; replace the body, not the
route path, when building that module.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/ai", tags=["AI"])


@router.get("/ping")
def ping():
    """Sanity check that this router is mounted. Remove once real routes exist."""
    return {"router": "ai", "status": "not_implemented_yet", "module": 5}
