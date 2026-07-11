"""
Public customer flow: QR scan, submit rating, submit review/feedback.

Status: STUB — folder/routing wired up in Module 1 (project setup).
Real endpoints land in Module 4. Every route below is a
placeholder that proves the router is mounted; replace the body, not the
route path, when building that module.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/customer", tags=["Customer"])


@router.get("/ping")
def ping():
    """Sanity check that this router is mounted. Remove once real routes exist."""
    return {"router": "customer", "status": "not_implemented_yet", "module": 4}
