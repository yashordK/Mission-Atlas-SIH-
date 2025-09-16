export interface Tourist {
  id: string;
  name: string;
  digitalId: string;
  safetyScore: number;
  location: { lat: number; lng: number };
  emergencyContact: string;
  itinerary: string;
  isTracking: boolean;
  lastSeen: Date;
}

export interface Incident {
  id: string;
  type: 'emergency' | 'warning';
  title: string;
  description: string;
  location: { lat: number; lng: number };
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
  reportedBy: string;
  status: 'active' | 'resolved';
}

export interface Notification {
  id: string;
  type: 'emergency' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}
