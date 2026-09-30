"""Data router — equipment, work orders, analytics, alerts."""
from fastapi import APIRouter, Query
from typing import Optional
from services.synthetic_data_service import (
    get_dashboard_data,
    get_equipment,
    get_equipment_by_id,
    get_work_orders,
    get_analytics_summary,
    ALERT_HISTORY,
    TECHNICIANS,
    PLANTS,
)
from fastapi import HTTPException

router = APIRouter(prefix="/data")


@router.get("/dashboard")
async def dashboard():
    return get_dashboard_data()


@router.get("/equipment")
async def equipment(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    plant_id: Optional[str] = None,
    search: Optional[str] = None,
):
    return get_equipment(page=page, page_size=page_size, status=status, plant_id=plant_id, search=search)


@router.get("/equipment/{equipment_id}")
async def equipment_detail(equipment_id: str):
    item = get_equipment_by_id(equipment_id)
    if not item:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return item


@router.get("/work-orders")
async def work_orders(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: Optional[str] = None,
    priority: Optional[str] = None,
):
    return get_work_orders(page=page, page_size=page_size, status=status, priority=priority)


@router.get("/analytics")
async def analytics():
    return get_analytics_summary()


@router.get("/alerts")
async def alerts():
    return {"items": ALERT_HISTORY[:20], "total": len(ALERT_HISTORY)}


@router.get("/technicians")
async def technicians():
    return {"items": TECHNICIANS}


@router.get("/plants")
async def plants():
    return {"items": PLANTS}
