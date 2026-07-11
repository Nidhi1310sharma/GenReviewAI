"""
QR code generation and lookup per business.

Status: STUB — folder/routing wired up in Module 1 (project setup).
Real endpoints land in Module 4. Every route below is a
placeholder that proves the router is mounted; replace the body, not the
route path, when building that module.
"""
from fastapi import APIRouter

router = APIRouter(prefix="/qr", tags=["QR"])


@router.get("/ping")
def ping():
    """Sanity check that this router is mounted. Remove once real routes exist."""
    return {"router": "qr", "status": "not_implemented_yet", "module": 4}
