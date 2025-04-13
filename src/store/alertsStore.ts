// src/store/alertsStore.ts
import { create } from 'zustand';

export type Severity = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Alert {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  intensity: number; // Percentage 0-100
  timestamp: Date;
}

interface AlertState {
  alerts: Alert[];
  // Potential actions (add, remove, update) could be added here
  // addAlert: (alert: Alert) => void;
}

// Dummy Data
const initialAlerts: Alert[] = [
  {
    id: 'alert-1',
    title: 'Large SOL Transfer',
    description: 'Wallet 5rk... transferred 15,000 SOL to new wallet.',
    severity: 'High',
    intensity: 75,
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: 'alert-2',
    title: 'Token Spike - $WIF',
    description: 'Unusual volume spike detected for $WIF token.',
    severity: 'Medium',
    intensity: 50,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
   {
    id: 'alert-3',
    title: 'Potential Phishing Contract',
    description: 'Contract interaction flagged by multiple sources: 3Ph...abc.',
    severity: 'Critical',
    intensity: 95,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
   {
    id: 'alert-4',
    title: 'Frequent Small Transfers',
    description: 'Wallet 9Tz... involved in rapid, small outbound transfers.',
    severity: 'Medium',
    intensity: 40,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
  },
];

export const useAlertStore = create<AlertState>((set) => ({
  alerts: initialAlerts,
  // Example action implementation:
  // addAlert: (alert) => set((state) => ({ alerts: [...state.alerts, alert] })),
}));