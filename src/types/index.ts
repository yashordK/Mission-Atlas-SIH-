export interface Tourist {
  id: string;
  name: string;
  digitalId: string;
  safetyScore: number;
  location: {
    lat: number;
    lng: number;
  };
  emergencyContact: string;
  itinerary: string;
  isTracking: boolean;
  lastSeen: Date;
}

export interface Incident {
  id: string;
  type: 'emergency' | 'warning' | 'info';
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  severity: 'high' | 'medium' | 'low';
  timestamp: Date;
  reportedBy: string;
  status: 'active' | 'resolved';
}

export interface Notification {
  id: string;
  type: 'emergency' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export type Language = 'en' | 'hi' | 'as' | 'bn' | 'mni' | 'lus' | 'kha' | 'nag' | 'brx';

export interface LanguageStrings {
  [key: string]: {
    [K in Language]: string;
  };
}