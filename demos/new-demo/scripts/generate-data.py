"""
generate-data.py — pre-generate demo data to JSON files for faster cold starts.
Run once: python scripts/generate-data.py
"""
import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from services.synthetic_data_service import (
    FLEET, WORK_ORDERS, ALERT_HISTORY, SENSOR_TIMESERIES, PLANTS, TECHNICIANS
)

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
os.makedirs(OUT_DIR, exist_ok=True)

def save(name, data):
    path = os.path.join(OUT_DIR, f'{name}.json')
    with open(path, 'w') as f:
        json.dump(data, f, indent=2, default=str)
    print(f"✅ Saved {len(data) if isinstance(data, list) else '1'} records → {path}")

save('equipment', FLEET)
save('work_orders', WORK_ORDERS)
save('alerts', ALERT_HISTORY)
save('sensor_timeseries', SENSOR_TIMESERIES)
save('plants', PLANTS)
save('technicians', TECHNICIANS)

print(f"\n✅ Data generation complete → {OUT_DIR}")
print(f"   Equipment assets: {len(FLEET)}")
print(f"   Work orders: {len(WORK_ORDERS)}")
print(f"   Alert history: {len(ALERT_HISTORY)}")
