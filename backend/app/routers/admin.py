"""
Admin-only endpoints: platform-wide business/owner management.

Status: STUB — folder/routing wired up in Module 1 (project setup).
Real endpoints land in Module 3. Every route below is a
placeholder that proves the router is mounted; replace the body, not the
route path, when building that module.
"""
from fastapi import APIRouter
from app.config.supabase import supabase

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/ping")
def ping():
    return {
        "router": "admin",
        "status": "not_implemented_yet",
        "module": 3
    }


@router.get("/test-supabase")
def test_supabase():
    response = supabase.table("users").select("*").execute()

    return {
        "success": True,
        "data": response.data
    }
