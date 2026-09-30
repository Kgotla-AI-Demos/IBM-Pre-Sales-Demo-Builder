"""
Pydantic settings for the Predictive Maintenance demo backend.
All IBM service credentials are optional — demo runs fully in mock mode.
"""

from pydantic_settings import BaseSettings
from typing import List, Optional


class Settings(BaseSettings):
    # Demo mode: "mock" (default) or "live"
    DEMO_MODE: str = "mock"

    # IBM watsonx.ai credentials (only needed for DEMO_MODE=live)
    WATSONX_API_KEY: Optional[str] = None
    WATSONX_PROJECT_ID: Optional[str] = None
    WATSONX_URL: str = "https://us-south.ml.cloud.ibm.com"
    WATSONX_MODEL_ID: str = "meta-llama/llama-4-maverick-17b-128e-instruct-fp8"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
