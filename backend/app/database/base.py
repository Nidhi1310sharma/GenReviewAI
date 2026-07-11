"""
Declarative base every SQLAlchemy model inherits from.

Kept in its own module (rather than in session.py) so Alembic's env.py can
import Base and pick up model metadata without also importing the engine.
"""
from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    pass
