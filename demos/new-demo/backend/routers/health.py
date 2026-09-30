"""Health check router."""
from fastapi import APIRouter
from config import settings

router = APIRouter()


@router.get("/health")
async def health():
    return {
        "status": "ok",
        "mode": settings.DEMO_MODE,
        "version": "1.0.0",
        "disclaimer": "Demonstration environment. All data is synthetic. No real client data or PII is used.",
        "product": "Factory AI Predictive Maintenance — Built with IBM watsonx",
    }
