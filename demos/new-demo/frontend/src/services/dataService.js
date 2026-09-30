import api from './api.js';
import { MOCK_DASHBOARD } from '../data/mockResponses/index.js';

export async function fetchDashboardData() {
  try {
    return await api.get('/data/dashboard');
  } catch {
    return MOCK_DASHBOARD;
  }
}

export async function fetchEquipment(params = {}) {
  try {
    return await api.get('/data/equipment', { params });
  } catch {
    return { items: [], total: 0 };
  }
}

export async function fetchWorkOrders(params = {}) {
  try {
    return await api.get('/data/work-orders', { params });
  } catch {
    return { items: [], total: 0 };
  }
}

export async function fetchAnalytics() {
  try {
    return await api.get('/data/analytics');
  } catch {
    return {};
  }
}
