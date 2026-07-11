"""
Owner and admin dashboard aggregates.

Status: STUB — folder/routing wired up in Module 1 (project setup).
Real endpoints land in Module 7. Every route below is a
placeholder that proves the router is mounted; replace the body, not the
route path, when building that module.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/ping")
def ping():
    """Sanity check that this router is mounted. Remove once real routes exist."""
    return {"router": "analytics", "status": "not_implemented_yet", "module": 7}
