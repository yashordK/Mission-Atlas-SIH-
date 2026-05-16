// src/App.tsx
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LanguageProvider } from './components/LanguageProvider';
import TopBar from './components/TopBar';
import LiveMap from './components/LiveMap';
import PanicButton from "./components/PanicButton";
import Sidebar from './components/Sidebar';
import SafetyScore from './components/SafetyScore';
import { Tourist, Incident, Notification } from './types';

// Mock data
const mockTourists: Tourist[] = [
  { id: '1', name: 'Rohit Sharma', digitalId: 'TD001', safetyScore: 85, location: { lat: 26.1445, lng: 91.7362 }, emergencyContact: '+91-9876543210', itinerary: 'Guwahati Tour', isTracking: true, lastSeen: new Date() },
  { id: '2', name: 'Ananya Das', digitalId: 'TD002', safetyScore: 92, location: { lat: 25.5788, lng: 91.8933 }, emergencyContact: '+91-9123456780', itinerary: 'Shillong Sightseeing', isTracking: false, lastSeen: new Date(Date.now() - 300000) },
  { id: '3', name: 'Michael Lee', digitalId: 'TD003', safetyScore: 45, location: { lat: 27.0980, lng: 93.6167 }, emergencyContact: '+91-9988776655', itinerary: 'Ziro Valley Visit', isTracking: true, lastSeen: new Date(Date.now() - 600000) }
];

const mockIncidents: Incident[] = [
  { id: '1', type: 'emergency', title: 'Medical Emergency', description: 'Breathing difficulty near Cherrapunji', location: { lat: 25.2843, lng: 91.7308 }, severity: 'high', timestamp: new Date(Date.now() - 1800000), reportedBy: 'Emergency Services', status: 'active' },
  { id: '2', type: 'warning', title: 'Theft Alert', description: 'Theft at Dimapur Station', location: { lat: 25.9091, lng: 93.7266 }, severity: 'medium', timestamp: new Date(Date.now() - 3600000), reportedBy: 'Nagaland Police', status: 'active' }
];

const mockNotifications: Notification[] = [
  { id: '1', type: 'emergency', title: 'High Risk Tourist', message: 'Mike Johnson has low safety score (45/100)', timestamp: new Date(), read: false },
  { id: '2', type: 'warning', title: 'New Incident', message: 'Pickpocket alert in Midtown area', timestamp: new Date(Date.now() - 300000), read: false }
];

function App() {
  const [tourists, setTourists] = useState<Tourist[]>(mockTourists);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const handlePanic = (location: { lat: number; lng: number }) => {
    const newIncident: Incident = {
      id: uuidv4(),
      type: 'emergency',
      title: 'Panic Button Activated',
      description: 'Tourist activated panic button',
      location,
      severity: 'high',
      timestamp: new Date(),
      reportedBy: 'Tourist',
      status: 'active'
    };
    setIncidents(prev => [newIncident, ...prev]);
  };

  const averageSafetyScore = Math.round(tourists.reduce((sum, t) => sum + t.safetyScore, 0) / tourists.length);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation Bar */}
        <TopBar userName="Admin" />

        {/* Sidebar */}
        <div className="fixed top-16 left-0 bottom-0 w-96 overflow-y-auto bg-white shadow-lg">
          <Sidebar
            notifications={notifications}
            onMarkAsRead={(id) => setNotifications(n => n.map(nf => nf.id === id ? { ...nf, read: true } : nf))}
            onDismissNotification={(id) => setNotifications(n => n.filter(nf => nf.id !== id))}
            onAddIncident={() => {}}
          />
        </div>

        {/* Main Content Area */}
        <main className="pt-16 pl-96 h-screen overflow-auto p-4">
          {/* Safety Score */}
          <SafetyScore score={averageSafetyScore} />

          {/* Live Map */}
          <div className="h-[500px] w-full mt-4">
            <LiveMap tourists={mockTourists} incidents={mockIncidents} />
          </div>
        </main>

        {/* Panic Button */}
        {/* <PanicButton onPanic={handlePanic} /> */}
      </div>
    </LanguageProvider>
  );
}

export default App;
