"""
Pydantic settings for the Predictive Maintenance demo backend.
All IBM service credentials are optional — demo runs fully in mock mode.

CORS_ORIGINS env var accepts a comma-separated list so it can be configured
at runtime in IBM Cloud Code Engine without a code change, e.g.:
  CORS_ORIGINS=https://factory-ai-demo.netlify.app,http://localhost:5173
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
from pydantic import field_validator


class Settings(BaseSettings):
    # Demo mode: "mock" (default) or "live"
    DEMO_MODE: str = "mock"

    # IBM watsonx.ai credentials (only needed for DEMO_MODE=live)
    WATSONX_API_KEY: Optional[str] = None
    WATSONX_PROJECT_ID: Optional[str] = None
    WATSONX_URL: str = "https://us-south.ml.cloud.ibm.com"
    WATSONX_MODEL_ID: str = "meta-llama/llama-4-maverick-17b-128e-instruct-fp8"

    # CORS — accepts comma-separated string from env OR a list (pydantic default)
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors(cls, v):
        """Allow CORS_ORIGINS to be supplied as a comma-separated string in env."""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
