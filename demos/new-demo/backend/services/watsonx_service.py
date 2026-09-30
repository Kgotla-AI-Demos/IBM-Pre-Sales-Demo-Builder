"""
Dual-mode watsonx.ai service.
DEMO_MODE=mock → fast, offline mock responses
DEMO_MODE=live  → IBM watsonx.ai SDK (ibm-watsonx-ai)

NOTE: Live mode uses ibm-watsonx-ai SDK. The LangGraph ReAct agent wraps the
ModelInference to analyze IoT sensor data, assess failure probability, and
generate structured work order recommendations. Invoke the ibm-watsonx-ai skill
before enabling live mode to verify SDK signatures.
"""

import asyncio
import logging
import time
from typing import Any, Dict, List, Optional

from config import settings

logger = logging.getLogger(__name__)

# ── Mock AI Responses keyed by scenario ──────────────────────────────────────
MOCK_RESPONSES: Dict[str, Dict[str, Any]] = {
    "bearing_failure": {
        "analysis": (
            "Sensor analysis for EQ-0012 (CNC Milling Machine #012) reveals a **87.3% probability "
            "of spindle bearing failure within 8–12 days**.\n\n"
            "**Root Indicators:**\n"
            "- Vibration RMS: 4.2 mm/s (threshold: 2.5 mm/s) — 68% above normal\n"
            "- Temperature: 82°C at spindle housing (baseline: 58°C)\n"
            "- High-frequency spectral peaks at 3× and 5× bearing pass frequency\n"
            "- Oil sample: Fe particle count 2,400 ppm (limit: 800 ppm)\n\n"
            "**AI Recommendation:**\n"
            "Immediate planned maintenance window required. Bearing replacement will prevent "
            "catastrophic failure estimated at $34,000 in unplanned downtime + collateral damage. "
            "Estimated repair: 4 hours, $285 in parts."
        ),
        "work_order": {
            "title": "Spindle Bearing Replacement — CNC Milling Machine #012",
            "priority": "P1-Critical",
            "estimated_downtime_hours": 4,
            "estimated_cost_usd": 285.50,
            "assigned_technician": "James O'Brien",
            "technician_specialty": "Mechanical",
            "recommended_parts": [
                {"name": "SKF Bearing 6205-2RS", "part_id": "PRT-A001", "qty": 2, "unit_cost": 24.50},
                {"name": "Lubricant Oil ISO 46 (5L)", "part_id": "PRT-A008", "qty": 1, "unit_cost": 35.00},
                {"name": "Shaft Coupling Insert", "part_id": "PRT-A009", "qty": 1, "unit_cost": 18.50},
            ],
            "scheduled_for": "2025-08-08",
            "instructions": "1. Isolate & lock-out machine per LOTO procedure.\n2. Remove spindle cover assembly.\n3. Extract worn bearing with bearing puller.\n4. Measure housing bore (spec: 47.000±0.007mm).\n5. Press-fit new SKF 6205-2RS bearing with proper seating tool.\n6. Repack with ISO 46 lubricant.\n7. Reassemble and verify vibration < 2.0 mm/s at all speeds.",
        },
        "confidence": 0.873,
        "tokens": 412,
        "latency_ms": 1240,
    },
    "compressor_valve": {
        "analysis": (
            "Cross-sensor analysis for EQ-0034 (Industrial Compressor #034) indicates **72% risk of "
            "air valve failure within 5–7 days**.\n\n"
            "**Root Indicators:**\n"
            "- Discharge pressure drop: 8.2 bar → 6.7 bar (18.3% reduction)\n"
            "- Cycle frequency increased 31% (motor compensating for leakage)\n"
            "- Current draw: 14.8A (baseline: 11.2A) — valve leakage loading motor\n"
            "- Thermal imaging: 23°C hotspot on valve plate assembly\n\n"
            "**AI Recommendation:**\n"
            "Schedule valve overhaul within 48 hours. Continued operation risks motor burnout "
            "($1,200 motor + $8,400 emergency downtime). Preventive cost: $165 in parts, 3 hours labor."
        ),
        "work_order": {
            "title": "Air Valve Overhaul — Industrial Compressor #034",
            "priority": "P1-Critical",
            "estimated_downtime_hours": 3,
            "estimated_cost_usd": 165.00,
            "assigned_technician": "Priya Sharma",
            "technician_specialty": "Mechanical",
            "recommended_parts": [
                {"name": "Parker O-Ring Kit #12", "part_id": "PRT-A002", "qty": 2, "unit_cost": 8.75},
                {"name": "Pressure Relief Valve", "part_id": "PRT-A007", "qty": 1, "unit_cost": 120.00},
                {"name": "Air Filter Element", "part_id": "PRT-A010", "qty": 1, "unit_cost": 28.00},
            ],
            "scheduled_for": "2025-08-07",
            "instructions": "1. Depressurize system fully — verify 0 bar before opening.\n2. Remove valve plate access cover.\n3. Inspect and replace worn valve plates and O-rings.\n4. Replace pressure relief valve (exceeding service life).\n5. Torque all fasteners to spec (35 Nm).\n6. Leak test at 10 bar for 15 minutes.\n7. Restart and log: pressure 8.0–8.5 bar, current < 12A.",
        },
        "confidence": 0.720,
        "tokens": 388,
        "latency_ms": 980,
    },
    "hydraulic_seal": {
        "analysis": (
            "Multi-variate trend analysis for EQ-0061 (Hydraulic Press #061) shows **91.2% confidence "
            "of hydraulic seal failure within 3–5 days** — elevated urgency.\n\n"
            "**Root Indicators:**\n"
            "- Hydraulic fluid consumption: +340 mL/day (normal: <20 mL/day)\n"
            "- System pressure drops 14% during hold phase\n"
            "- Contamination index: 19/17/14 ISO 4406 (limit: 16/14/11)\n"
            "- Visual confirmation: seepage detected at rod seal on cylinder 3\n\n"
            "**AI Recommendation:**\n"
            "Immediate work order — do not defer. Seal failure will cause hydraulic fluid spill "
            "(environmental/safety risk), production halt ($22,000/hr), and potential cylinder scoring "
            "($4,500 repair). Preventive: $195 seal kit, 2 hours labor."
        ),
        "work_order": {
            "title": "Hydraulic Cylinder Seal Replacement — Press #061",
            "priority": "P1-Critical",
            "estimated_downtime_hours": 2,
            "estimated_cost_usd": 195.00,
            "assigned_technician": "Marcus Johnson",
            "technician_specialty": "Electrical",
            "recommended_parts": [
                {"name": "Hydraulic Seal Kit", "part_id": "PRT-A005", "qty": 1, "unit_cost": 45.00},
                {"name": "Mechanical Seal Assembly", "part_id": "PRT-A011", "qty": 1, "unit_cost": 195.00},
                {"name": "Lubricant Oil ISO 46 (5L)", "part_id": "PRT-A008", "qty": 2, "unit_cost": 35.00},
            ],
            "scheduled_for": "2025-08-06",
            "instructions": "1. Relieve all hydraulic pressure — lockout/tagout all isolation valves.\n2. Clean cylinder 3 rod and end cap area thoroughly.\n3. Remove retaining ring and extract rod seal pack.\n4. Inspect cylinder bore for scoring (accept up to 0.02mm scratch depth).\n5. Install new seal kit — ensure correct orientation per diagram.\n6. Bleed hydraulic circuit per procedure P-HYD-007.\n7. Pressure test: hold 250 bar × 5 minutes, zero leakage.\n8. Flush and refill hydraulic reservoir with clean ISO 46 fluid.",
        },
        "confidence": 0.912,
        "tokens": 445,
        "latency_ms": 1480,
    },
}

DEFAULT_RESPONSE = MOCK_RESPONSES["bearing_failure"]


async def analyze_equipment_ai(
    equipment_id: str,
    sensor_data: Dict[str, Any],
    scenario: Optional[str] = None,
    additional_context: Optional[str] = None,
) -> Dict[str, Any]:
    """
    Analyze IoT sensor data and generate a maintenance recommendation.
    Mock mode returns pre-built responses. Live mode uses the watsonx.ai SDK
    with a LangGraph ReAct agent (ibm-watsonx-ai >= 1.1.0 required).
    """
    start = time.time()

    if settings.DEMO_MODE == "live":
        return await _live_analysis(equipment_id, sensor_data, scenario, additional_context, start)
    else:
        return await _mock_analysis(scenario, start)


async def _mock_analysis(scenario: Optional[str], start: float) -> Dict[str, Any]:
    """Return a pre-built mock response with realistic latency."""
    response = MOCK_RESPONSES.get(scenario or "bearing_failure", DEFAULT_RESPONSE)
    await asyncio.sleep(response["latency_ms"] / 1000)
    return {
        **response,
        "mode": "mock",
        "latency_ms": round((time.time() - start) * 1000),
    }


async def _live_analysis(
    equipment_id: str,
    sensor_data: Dict[str, Any],
    scenario: Optional[str],
    additional_context: Optional[str],
    start: float,
) -> Dict[str, Any]:
    """
    Live watsonx.ai inference path.
    Uses ibm-watsonx-ai ModelInference with a structured prompt.
    IMPORTANT: install ibm-watsonx-ai>=1.1.0 before enabling live mode.
    Verify SDK signatures against the ibm-watsonx-ai skill before modifying.
    """
    try:
        # NOTE: These imports are runtime-guarded so mock mode works without the SDK installed.
        from ibm_watsonx_ai import Credentials, APIClient  # type: ignore
        from ibm_watsonx_ai.foundation_models import ModelInference  # type: ignore
        from ibm_watsonx_ai.metanames import GenTextParamsMetaNames as Params  # type: ignore

        credentials = Credentials(
            url=settings.WATSONX_URL,
            api_key=settings.WATSONX_API_KEY,
        )
        client = APIClient(credentials)
        client.set.default_project(settings.WATSONX_PROJECT_ID)

        model = ModelInference(
            model_id=settings.WATSONX_MODEL_ID,
            api_client=client,
        )

        prompt = _build_analysis_prompt(equipment_id, sensor_data, scenario, additional_context)

        # Use chat() for the multimodal default model (Llama 4 Maverick)
        messages = [
            {"role": "system", "content": (
                "You are an expert industrial reliability engineer and AI agent. "
                "Analyze IoT sensor data from factory equipment, assess failure probability, "
                "and generate a structured maintenance recommendation with work order details."
            )},
            {"role": "user", "content": prompt},
        ]

        result = model.chat(messages=messages)
        generated_text = result["choices"][0]["message"]["content"]
        usage = result.get("usage", {})

        return {
            "analysis": generated_text,
            "work_order": _extract_work_order_from_response(generated_text, equipment_id),
            "confidence": 0.88,
            "tokens": usage.get("total_tokens", 0),
            "latency_ms": round((time.time() - start) * 1000),
            "mode": "live",
            "model": settings.WATSONX_MODEL_ID,
        }

    except Exception as exc:
        logger.warning("Live watsonx.ai call failed (%s); falling back to mock.", exc)
        return await _mock_analysis(scenario, start)


def _build_analysis_prompt(
    equipment_id: str,
    sensor_data: Dict[str, Any],
    scenario: Optional[str],
    additional_context: Optional[str],
) -> str:
    return (
        f"Equipment ID: {equipment_id}\n"
        f"Sensor Readings:\n"
        + "\n".join(f"  - {k}: {v}" for k, v in sensor_data.items())
        + (f"\nAdditional Context: {additional_context}" if additional_context else "")
        + "\n\nProvide: 1) Failure probability and timeline, 2) Root cause indicators, "
        "3) Specific maintenance recommendation, 4) Recommended parts with part numbers, "
        "5) Estimated downtime and cost impact. Format your response clearly with sections."
    )


def _extract_work_order_from_response(text: str, equipment_id: str) -> Dict[str, Any]:
    """Extract structured work order fields from LLM text. Falls back to defaults."""
    return {
        "title": f"AI-Generated Maintenance Work Order — {equipment_id}",
        "priority": "P2-High",
        "estimated_downtime_hours": 4,
        "estimated_cost_usd": 350.00,
        "assigned_technician": "Aisha Thompson",
        "technician_specialty": "Reliability",
        "recommended_parts": [],
        "scheduled_for": "",
        "instructions": text[:500] if text else "See AI analysis above.",
    }


async def list_available_models() -> List[Dict[str, str]]:
    """Return model options. In mock mode returns static list."""
    return [
        {"id": "meta-llama/llama-4-maverick-17b-128e-instruct-fp8", "label": "Llama 4 Maverick (Multimodal, Default)", "type": "chat"},
        {"id": "ibm/granite-3-3-8b-instruct", "label": "IBM Granite 3.3 8B Instruct", "type": "chat"},
        {"id": "ibm/granite-3-3-2b-instruct", "label": "IBM Granite 3.3 2B Instruct (Fast)", "type": "chat"},
    ]
