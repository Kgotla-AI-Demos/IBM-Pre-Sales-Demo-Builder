import React, { createContext, useContext, useReducer } from 'react';

const DemoContext = createContext(null);

const initialState = {
  demoMode: import.meta.env.VITE_DEMO_MODE || 'mock',
  demoTitle: import.meta.env.VITE_DEMO_TITLE || 'Factory AI Predictive Maintenance',
  clientCode: import.meta.env.VITE_DEMO_CLIENT_CODE || 'DEMO-MFG-001',
  isLoading: false,
  aiResponse: null,
  selectedScenario: null,
  notifications: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, isLoading: action.payload };
    case 'SET_AI_RESPONSE': return { ...state, aiResponse: action.payload, isLoading: false };
    case 'SET_SCENARIO': return { ...state, selectedScenario: action.payload };
    case 'ADD_NOTIFICATION': return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 5) };
    case 'RESET_DEMO': return { ...initialState };
    default: return state;
  }
}

export function DemoProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DemoContext.Provider value={{ state, dispatch }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemoContext() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemoContext must be used within DemoProvider');
  return ctx;
}
