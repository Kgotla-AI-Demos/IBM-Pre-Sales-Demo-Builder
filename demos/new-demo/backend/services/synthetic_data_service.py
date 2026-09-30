"""
Synthetic data generator for the Factory AI Predictive Maintenance demo.
Faker seed=42 for reproducibility. All data is fictional.
Companies, equipment IDs, technician names are entirely synthetic.
"""

import random
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from faker import Faker

fake = Faker()
Faker.seed(42)
random.seed(42)

# ── Fictional Companies ──────────────────────────────────────────────────────
PLANTS = [
    {"id": "PLT-001", "name": "Apex Manufacturing - Detroit", "region": "Great Lakes"},
    {"id": "PLT-002", "name": "NovaTech Solutions - Houston", "region": "Gulf Coast"},
    {"id": "PLT-003", "name": "BlueLine Logistics - Chicago", "region": "Midwest"},
    {"id": "PLT-004", "name": "Ironbridge Construction - Pittsburgh", "region": "Northeast"},
    {"id": "PLT-005", "name": "Pinnacle Energy - Dallas", "region": "Southwest"},
]

# ── Equipment types & specs ──────────────────────────────────────────────────
EQUIPMENT_TYPES = [
    {"type": "CNC Milling Machine", "manufacturer": "Haas Automation", "failure_modes": ["spindle bearing", "coolant pump", "axis servo drive"]},
    {"type": "Industrial Compressor", "manufacturer": "Atlas Copco", "failure_modes": ["air valve", "piston ring", "crankshaft bearing"]},
    {"type": "Conveyor System", "manufacturer": "Dorner Mfg", "failure_modes": ["belt tension", "drive motor", "idler roller"]},
    {"type": "Hydraulic Press", "manufacturer": "Greenerd Press", "failure_modes": ["hydraulic seal", "pump motor", "pressure relief valve"]},
    {"type": "Welding Robot", "manufacturer": "FANUC", "failure_modes": ["torch nozzle", "wire feed system", "servo motor"]},
    {"type": "Lathe Machine", "manufacturer": "Mazak", "failure_modes": ["spindle motor", "chuck jaw", "feed screw"]},
    {"type": "Injection Mold Press", "manufacturer": "Engel", "failure_modes": ["barrel heater", "screw plasticizer", "ejector pin"]},
    {"type": "Centrifugal Pump", "manufacturer": "Grundfos", "failure_modes": ["impeller", "mechanical seal", "bearing assembly"]},
]

TECHNICIANS = [
    {"id": "TECH-001", "name": "Marcus Johnson", "specialty": "Electrical", "certifications": ["PLC", "VFD", "HMI"]},
    {"id": "TECH-002", "name": "Priya Sharma", "specialty": "Mechanical", "certifications": ["Hydraulics", "Pneumatics", "Welding"]},
    {"id": "TECH-003", "name": "Carlos Rivera", "specialty": "Instrumentation", "certifications": ["Calibration", "SCADA", "Sensors"]},
    {"id": "TECH-004", "name": "Aisha Thompson", "specialty": "Reliability", "certifications": ["Vibration Analysis", "Thermography", "Oil Analysis"]},
    {"id": "TECH-005", "name": "Wei Zhang", "specialty": "Electrical", "certifications": ["Motors", "Drives", "Power Systems"]},
    {"id": "TECH-006", "name": "James O'Brien", "specialty": "Mechanical", "certifications": ["CNC", "Precision Machining", "Alignment"]},
]

PARTS_CATALOG = [
    {"part_id": "PRT-A001", "name": "SKF Bearing 6205-2RS", "category": "Bearings", "unit_cost": 24.50, "lead_days": 2},
    {"part_id": "PRT-A002", "name": "Parker O-Ring Kit #12", "category": "Seals", "unit_cost": 8.75, "lead_days": 1},
    {"part_id": "PRT-A003", "name": "Coolant Pump Assembly", "category": "Pumps", "unit_cost": 340.00, "lead_days": 5},
    {"part_id": "PRT-A004", "name": "V-Belt Set (5x)", "category": "Drive Components", "unit_cost": 62.00, "lead_days": 1},
    {"part_id": "PRT-A005", "name": "Hydraulic Seal Kit", "category": "Seals", "unit_cost": 45.00, "lead_days": 2},
    {"part_id": "PRT-A006", "name": "AC Servo Motor 1.5kW", "category": "Motors", "unit_cost": 890.00, "lead_days": 7},
    {"part_id": "PRT-A007", "name": "Pressure Relief Valve", "category": "Valves", "unit_cost": 120.00, "lead_days": 3},
    {"part_id": "PRT-A008", "name": "Lubricant Oil ISO 46 (5L)", "category": "Consumables", "unit_cost": 35.00, "lead_days": 1},
    {"part_id": "PRT-A009", "name": "Shaft Coupling Insert", "category": "Drive Components", "unit_cost": 18.50, "lead_days": 2},
    {"part_id": "PRT-A010", "name": "Air Filter Element", "category": "Filtration", "unit_cost": 28.00, "lead_days": 1},
    {"part_id": "PRT-A011", "name": "Mechanical Seal Assembly", "category": "Seals", "unit_cost": 195.00, "lead_days": 4},
    {"part_id": "PRT-A012", "name": "Wire Feed Drive Roll Kit", "category": "Welding", "unit_cost": 55.00, "lead_days": 2},
]

STATUS_COLORS = {
    "Normal": "green",
    "Warning": "yellow",
    "Critical": "red",
    "Offline": "gray",
    "Maintenance": "blue",
}

WORK_ORDER_STATUS = ["Open", "Assigned", "In Progress", "Completed", "Deferred"]
PRIORITY = ["P1-Critical", "P2-High", "P3-Medium", "P4-Low"]


def _rand_float(base: float, variance: float) -> float:
    return round(base + random.uniform(-variance, variance), 2)


def _generate_sensor_reading(equipment_status: str) -> Dict[str, Any]:
    """Generate realistic IoT sensor readings based on equipment health."""
    multiplier = {"Normal": 1.0, "Warning": 1.25, "Critical": 1.6, "Offline": 0.0, "Maintenance": 0.5}.get(equipment_status, 1.0)
    return {
        "vibration_mm_s": round(random.uniform(0.5, 2.0) * multiplier, 3),
        "temperature_c": round(random.uniform(45, 65) * (multiplier if multiplier > 0 else 1), 1),
        "current_amps": round(random.uniform(8, 12) * (multiplier if multiplier > 0 else 0), 2),
        "pressure_bar": round(random.uniform(4, 6) * random.uniform(0.9, 1.1), 2),
        "oil_viscosity_cst": round(random.uniform(42, 48) * (1 + (multiplier - 1) * 0.3), 1),
        "noise_db": round(random.uniform(65, 75) * multiplier, 1),
    }


# ── Equipment fleet (500 assets across 5 plants) ─────────────────────────────
def _build_equipment_fleet() -> List[Dict[str, Any]]:
    fleet = []
    for i in range(120):
        plant = PLANTS[i % len(PLANTS)]
        eq_type = EQUIPMENT_TYPES[i % len(EQUIPMENT_TYPES)]
        install_date = datetime.now() - timedelta(days=random.randint(365, 3650))
        last_maint = datetime.now() - timedelta(days=random.randint(10, 180))
        next_maint = last_maint + timedelta(days=random.randint(90, 180))
        age_years = (datetime.now() - install_date).days / 365
        # Older equipment more likely to be in warning/critical
        health_score = max(20, round(100 - age_years * 8 + random.uniform(-10, 10)))
        if health_score >= 80:
            status = "Normal"
        elif health_score >= 55:
            status = "Warning"
        elif health_score > 30:
            status = "Critical"
        else:
            status = "Maintenance" if random.random() > 0.4 else "Offline"

        fleet.append({
            "equipment_id": f"EQ-{str(i+1).zfill(4)}",
            "name": f"{eq_type['type']} #{str(i+1).zfill(3)}",
            "type": eq_type["type"],
            "manufacturer": eq_type["manufacturer"],
            "model": f"M{random.randint(1000,9999)}",
            "serial": fake.bothify("SN-#####-???").upper(),
            "plant_id": plant["id"],
            "plant_name": plant["name"],
            "region": plant["region"],
            "location": f"Bay {chr(65 + (i % 8))}-{random.randint(1,20)}",
            "install_date": install_date.strftime("%Y-%m-%d"),
            "last_maintenance": last_maint.strftime("%Y-%m-%d"),
            "next_maintenance_due": next_maint.strftime("%Y-%m-%d"),
            "health_score": health_score,
            "status": status,
            "age_years": round(age_years, 1),
            "operating_hours": random.randint(5000, 45000),
            "failure_mode": eq_type["failure_modes"][i % len(eq_type["failure_modes"])],
            "sensor_data": _generate_sensor_reading(status),
            "ai_risk_score": max(0, min(100, 100 - health_score + random.randint(-5, 15))),
            "predicted_failure_days": random.randint(3, 90) if status in ("Warning", "Critical") else None,
        })
    return fleet


FLEET = _build_equipment_fleet()


# ── Sensor time-series (30 days for chart) ──────────────────────────────────
def _build_sensor_timeseries() -> List[Dict[str, Any]]:
    series = []
    for day in range(30):
        date = datetime.now() - timedelta(days=29 - day)
        deteriorating = day > 20  # simulate trend
        series.append({
            "date": date.strftime("%Y-%m-%d"),
            "avg_vibration": round(0.8 + day * 0.04 * (1.5 if deteriorating else 0.5), 3),
            "avg_temperature": round(52 + day * 0.3 * (1.8 if deteriorating else 0.5), 1),
            "avg_current": round(9.2 + day * 0.05 * (1.2 if deteriorating else 0.3), 2),
            "alerts_count": max(0, day - 18) * 2 if deteriorating else random.randint(0, 2),
        })
    return series


SENSOR_TIMESERIES = _build_sensor_timeseries()


# ── Work orders ──────────────────────────────────────────────────────────────
def _build_work_orders() -> List[Dict[str, Any]]:
    orders = []
    critical_equipment = [eq for eq in FLEET if eq["status"] in ("Warning", "Critical")][:30]
    for i, eq in enumerate(critical_equipment):
        tech = TECHNICIANS[i % len(TECHNICIANS)]
        parts = random.sample(PARTS_CATALOG, random.randint(1, 3))
        created = datetime.now() - timedelta(days=random.randint(0, 14))
        scheduled = created + timedelta(days=random.randint(1, 5))
        status = WORK_ORDER_STATUS[i % len(WORK_ORDER_STATUS)]
        priority = "P1-Critical" if eq["status"] == "Critical" else "P2-High" if eq["ai_risk_score"] > 70 else "P3-Medium"
        total_cost = sum(p["unit_cost"] for p in parts)
        orders.append({
            "work_order_id": f"WO-{str(i+1).zfill(4)}-{fake.bothify('??').upper()}",
            "equipment_id": eq["equipment_id"],
            "equipment_name": eq["name"],
            "plant_name": eq["plant_name"],
            "failure_mode": eq["failure_mode"],
            "priority": priority,
            "status": status,
            "assigned_technician": tech["name"],
            "technician_id": tech["id"],
            "technician_specialty": tech["specialty"],
            "created_at": created.isoformat(),
            "scheduled_for": scheduled.strftime("%Y-%m-%d"),
            "estimated_downtime_hours": random.randint(2, 12),
            "estimated_cost_usd": round(total_cost + random.uniform(50, 400), 2),
            "recommended_parts": [{"part_id": p["part_id"], "name": p["name"], "qty": 1, "unit_cost": p["unit_cost"]} for p in parts],
            "ai_generated": True,
            "ai_confidence": round(random.uniform(0.78, 0.97), 2),
            "notes": f"Predictive maintenance alert: {eq['failure_mode']} showing early degradation indicators. Health score {eq['health_score']}%. Recommend inspection within {eq.get('predicted_failure_days', 14)} days.",
        })
    return orders


WORK_ORDERS = _build_work_orders()


# ── Alert history ─────────────────────────────────────────────────────────────
def _build_alert_history() -> List[Dict[str, Any]]:
    alerts = []
    for i in range(50):
        eq = FLEET[i % len(FLEET)]
        ts = datetime.now() - timedelta(hours=random.randint(1, 72 * 7))
        severity = random.choice(["Low", "Medium", "High", "Critical"])
        alerts.append({
            "alert_id": f"ALT-{str(i+1).zfill(5)}",
            "equipment_id": eq["equipment_id"],
            "equipment_name": eq["name"],
            "plant_name": eq["plant_name"],
            "sensor_type": random.choice(["Vibration", "Temperature", "Current", "Pressure", "Oil Quality"]),
            "severity": severity,
            "threshold_exceeded": f"{random.uniform(1.1, 2.5):.1f}x normal range",
            "timestamp": ts.isoformat(),
            "acknowledged": random.random() > 0.3,
            "work_order_created": random.random() > 0.5,
        })
    alerts.sort(key=lambda x: x["timestamp"], reverse=True)
    return alerts


ALERT_HISTORY = _build_alert_history()


# ── Public API functions ──────────────────────────────────────────────────────

def get_dashboard_data() -> Dict[str, Any]:
    """KPIs + charts for the dashboard landing page."""
    total = len(FLEET)
    normal = sum(1 for e in FLEET if e["status"] == "Normal")
    warning = sum(1 for e in FLEET if e["status"] == "Warning")
    critical = sum(1 for e in FLEET if e["status"] == "Critical")
    offline = sum(1 for e in FLEET if e["status"] in ("Offline", "Maintenance"))
    open_wo = sum(1 for w in WORK_ORDERS if w["status"] in ("Open", "Assigned", "In Progress"))
    avg_health = round(sum(e["health_score"] for e in FLEET) / total, 1)

    return {
        "kpis": [
            {"id": "total_assets", "label": "Total Assets Monitored", "value": total, "unit": "units", "trend": "+8 this quarter", "trend_up": True, "color": "blue"},
            {"id": "health_score", "label": "Fleet Health Score", "value": avg_health, "unit": "%", "trend": "-3.2 pts (30d)", "trend_up": False, "color": "yellow"},
            {"id": "open_workorders", "label": "Open Work Orders", "value": open_wo, "unit": "orders", "trend": "+5 this week", "trend_up": False, "color": "red"},
            {"id": "predictions_made", "label": "AI Predictions (30d)", "value": 247, "unit": "alerts", "trend": "94.1% accurate", "trend_up": True, "color": "green"},
        ],
        "status_distribution": [
            {"group": "Normal", "value": normal},
            {"group": "Warning", "value": warning},
            {"group": "Critical", "value": critical},
            {"group": "Offline/Maint", "value": offline},
        ],
        "sensor_trend": SENSOR_TIMESERIES,
        "recent_alerts": ALERT_HISTORY[:10],
        "equipment_by_plant": [
            {"group": p["name"].split(" - ")[1], "value": sum(1 for e in FLEET if e["plant_id"] == p["id"])}
            for p in PLANTS
        ],
    }


def get_equipment(
    page: int = 1,
    page_size: int = 20,
    status: Optional[str] = None,
    plant_id: Optional[str] = None,
    search: Optional[str] = None,
) -> Dict[str, Any]:
    filtered = FLEET.copy()
    if status:
        filtered = [e for e in filtered if e["status"].lower() == status.lower()]
    if plant_id:
        filtered = [e for e in filtered if e["plant_id"] == plant_id]
    if search:
        s = search.lower()
        filtered = [e for e in filtered if s in e["name"].lower() or s in e["equipment_id"].lower() or s in e["type"].lower()]
    total = len(filtered)
    start = (page - 1) * page_size
    end = start + page_size
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": filtered[start:end],
    }


def get_equipment_by_id(equipment_id: str) -> Optional[Dict[str, Any]]:
    return next((e for e in FLEET if e["equipment_id"] == equipment_id), None)


def get_work_orders(
    page: int = 1,
    page_size: int = 20,
    status: Optional[str] = None,
    priority: Optional[str] = None,
) -> Dict[str, Any]:
    filtered = WORK_ORDERS.copy()
    if status:
        filtered = [w for w in filtered if w["status"].lower() == status.lower()]
    if priority:
        filtered = [w for w in filtered if w["priority"].lower() == priority.lower()]
    total = len(filtered)
    start = (page - 1) * page_size
    end = start + page_size
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "items": filtered[start:end],
    }


def get_analytics_summary() -> Dict[str, Any]:
    return {
        "oee_current": 71.4,
        "oee_with_ai": 84.2,
        "downtime_hours_current_month": 47,
        "downtime_hours_predicted_month": 15,
        "mtbf_days": 42,
        "mttr_hours": 6.2,
        "cost_avoidance_ytd_usd": 1_240_000,
        "work_orders_ai_generated": len(WORK_ORDERS),
        "predictions_accuracy": 94.1,
        "avg_prediction_lead_days": 9.3,
        "parts_cost_reduction_pct": 22.4,
        "before_after": {
            "unplanned_downtime_before": 47,
            "unplanned_downtime_after": 15,
            "mtbf_before": 31,
            "mtbf_after": 42,
            "oee_before": 71.4,
            "oee_after": 84.2,
            "avg_repair_time_before": 9.8,
            "avg_repair_time_after": 6.2,
        },
    }
