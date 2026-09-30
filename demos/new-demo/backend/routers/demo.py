"""Demo config router."""
from fastapi import APIRouter
from config import settings

router = APIRouter(prefix="/demo")


@router.get("/config")
async def demo_config():
    return {
        "mode": settings.DEMO_MODE,
        "watsonx_configured": bool(settings.WATSONX_API_KEY and settings.WATSONX_PROJECT_ID),
        "model_id": settings.WATSONX_MODEL_ID,
        "disclaimer": "All data is synthetic. No real client data or PII is used.",
        "client_code": "DEMO-MFG-001",
    }
