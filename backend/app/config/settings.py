"""
Central application settings, loaded once from environment variables / .env.

Every other module reads config through `get_settings()` instead of calling
os.environ directly, so there is exactly one place that knows how config is
sourced.
"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- App ---
    app_name: str = "GenReview AI"
    app_env: str = "development"
    debug: bool = True
    api_v1_prefix: str = "/api/v1"

    # --- CORS ---
    cors_origins: str = "http://localhost:5500"

    # --- Database ---
    database_url: str = "postgresql://genreview_user:genreview_pass@localhost:5432/genreview_db"

    #---Supabase---
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""

    # --- Auth (Module 2) ---
    jwt_secret_key: str = "change-this-to-a-long-random-string"
    jwt_algorithm: str = "HS256"
    jwt_access_token_expire_minutes: int = 60

    # --- ML model paths (Module 5) ---
    sentiment_model_path: str = "ml/best_sentiment_model.pkl"
    tfidf_vectorizer_path: str = "ml/tfidf_vectorizer.pkl"
    label_encoder_path: str = "ml/label_encoder.pkl"

    # --- LLM (Module 6) ---
    anthropic_api_key: str = ""

    # --- Email (Module 7) ---
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_from_email: str = "alerts@genreview.ai"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Cached so the .env file is only parsed once per process."""
    return Settings()
