"""
FastAPI entry point for the Factory AI Predictive Maintenance demo backend.
Runs fully in mock mode with zero credentials.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routers import health, data, ai, demo

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=" * 60)
    logger.info("Factory AI Predictive Maintenance — IBM watsonx Demo")
    logger.info(f"Mode: {settings.DEMO_MODE.upper()}")
    logger.info("Disclaimer: All data is synthetic. No PII.")
    logger.info("=" * 60)
    yield
    logger.info("Backend shutting down.")


app = FastAPI(
    title="Factory AI Predictive Maintenance API",
    description="IBM watsonx demo backend — synthetic data, zero credentials in mock mode.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api")
app.include_router(data.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(demo.router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Factory AI Predictive Maintenance API — Built with IBM watsonx", "docs": "/docs"}
