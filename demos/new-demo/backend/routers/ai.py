"""AI inference router — analyze sensor data and generate work orders."""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Any, Dict, Optional
from services.watsonx_service import analyze_equipment_ai, list_available_models
from services.synthetic_data_service import get_equipment_by_id

router = APIRouter(prefix="/ai")


class AnalysisRequest(BaseModel):
    equipment_id: str = Field(..., description="Equipment asset ID (e.g. EQ-0012)")
    scenario: Optional[str] = Field(None, description="Demo scenario key: bearing_failure | compressor_valve | hydraulic_seal")
    additional_context: Optional[str] = Field(None, description="Optional free-text context for the AI")


@router.post("/analyze")
async def analyze(request: AnalysisRequest):
    """
    Analyze IoT sensor data for an equipment asset and generate a maintenance
    recommendation with an AI-created work order.
    """
    equipment = get_equipment_by_id(request.equipment_id)
    if not equipment:
        # Use a default equipment if ID not found (demo-friendly)
        sensor_data = {
            "vibration_mm_s": 4.2,
            "temperature_c": 82.0,
            "current_amps": 14.8,
            "pressure_bar": 6.7,
            "oil_viscosity_cst": 38.5,
            "noise_db": 88.3,
        }
    else:
        sensor_data = equipment["sensor_data"]

    result = await analyze_equipment_ai(
        equipment_id=request.equipment_id,
        sensor_data=sensor_data,
        scenario=request.scenario,
        additional_context=request.additional_context,
    )
    return result


@router.get("/models")
async def models():
    """Return available watsonx.ai model options."""
    return {"models": await list_available_models()}
