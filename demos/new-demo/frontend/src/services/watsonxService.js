import api from './api.js';
import { MOCK_RESPONSES } from '../data/mockResponses/index.js';

/** Analyze equipment sensor data and generate a work order recommendation. */
export async function analyzeEquipment({ equipmentId, scenario, additionalContext }) {
  try {
    return await api.post('/ai/analyze', {
      equipment_id: equipmentId,
      scenario,
      additional_context: additionalContext,
    });
  } catch {
    // Graceful fallback to mock
    return await _mockAnalysis(scenario);
  }
}

async function _mockAnalysis(scenario) {
  const delay = 800 + Math.random() * 600;
  await new Promise((r) => setTimeout(r, delay));
  return MOCK_RESPONSES[scenario] || MOCK_RESPONSES.bearing_failure;
}

export async function listModels() {
  try {
    return await api.get('/ai/models');
  } catch {
    return {
      models: [
        { id: 'meta-llama/llama-4-maverick-17b-128e-instruct-fp8', label: 'Llama 4 Maverick (Default)' },
        { id: 'ibm/granite-3-3-8b-instruct', label: 'IBM Granite 3.3 8B' },
      ],
    };
  }
}
