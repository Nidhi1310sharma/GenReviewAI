"""
FastAPI application entrypoint.

Run locally with:
    uvicorn app.main:app --reload

This is Module 1 (project setup): the app boots, connects to Postgres,
and every router from the target structure is mounted (each currently
returning a stub /ping response). Modules 2-7 fill in real logic behind
these same routes without changing this file.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import get_settings
from app.database import engine
from app.routers import admin, ai, analytics, auth, customer, owner, qr, reviews

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Fail fast and loud if the DB isn't reachable, instead of discovering
    # it on the first real request.
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print(f"[{settings.app_name}] Database connection OK.")
    except Exception as exc:  # noqa: BLE001 - intentional broad catch at boot
        print(f"[{settings.app_name}] WARNING: could not connect to the database on startup: {exc}")
    yield


app = FastAPI(
    title=settings.app_name,
    debug=settings.debug,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Every router from the agreed backend structure, mounted under one API
# version prefix. Each is a stub today (Module 1) and gets real endpoints
# added module by module — the mount points don't change.
app.include_router(auth.router, prefix=settings.api_v1_prefix)
app.include_router(admin.router, prefix=settings.api_v1_prefix)
app.include_router(owner.router, prefix=settings.api_v1_prefix)
app.include_router(customer.router, prefix=settings.api_v1_prefix)
app.include_router(reviews.router, prefix=settings.api_v1_prefix)
app.include_router(qr.router, prefix=settings.api_v1_prefix)
app.include_router(analytics.router, prefix=settings.api_v1_prefix)
app.include_router(ai.router, prefix=settings.api_v1_prefix)


@app.get("/health")
def health_check():
    """Basic liveness check — does not touch the database."""
    return {"status": "ok", "app": settings.app_name, "env": settings.app_env}
