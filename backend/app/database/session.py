"""
Database engine + session factory.

`get_db` is a FastAPI dependency: routers do
    def endpoint(db: Session = Depends(get_db)):
and get a session that is always closed after the request, even on error.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.config import get_settings

settings = get_settings()

engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,  # drops stale connections instead of erroring on them
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
