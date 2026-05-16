// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { Notification, Incident } from '../types';

interface SidebarProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onDismissNotification: (id: string) => void;
  onAddIncident: (incidentData: Omit<Incident, 'id' | 'timestamp'>) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  notifications,
  onMarkAsRead,
  onDismissNotification,
  onAddIncident
}) => {
  const [newIncident, setNewIncident] = useState<Omit<Incident, 'id' | 'timestamp'>>({
    title: '',
    description: '',
    severity: 'low',
    type: 'warning',
    location: { lat: 0, lng: 0 },
    reportedBy: '',
    status: 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddIncident(newIncident);
    // Reset the form
    setNewIncident({
      title: '',
      description: '',
      severity: 'low',
      type: 'warning',
      location: { lat: 0, lng: 0 },
      reportedBy: '',
      status: 'active'
    });
  };

  // Map severity to gradient backgrounds
  const severityBg = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-gradient-to-r from-red-600 to-red-400 text-white';
      case 'medium':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-200 text-gray-800';
      case 'low':
        return 'bg-gradient-to-r from-blue-500 to-blue-300 text-white';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="p-4 flex flex-col space-y-6 h-full overflow-y-auto bg-white shadow-lg">
      <h2 className="font-bold text-2xl mb-2">Notifications</h2>

      {/* Notification List */}
      <ul className="space-y-3">
        {notifications.map(n => (
          <li
            key={n.id}
            className={`p-3 rounded-lg shadow ${n.read ? 'bg-gray-100' : 'bg-white'}`}
          >
            <p className="font-semibold">{n.title}</p>
            <p className="text-sm text-gray-600">{n.message}</p>
            <div className="mt-2 flex gap-2">
              {!n.read && (
                <button
                  className="text-blue-500 text-xs hover:underline"
                  onClick={() => onMarkAsRead(n.id)}
                >
                  Mark as read
                </button>
              )}
              <button
                className="text-red-500 text-xs hover:underline"
                onClick={() => onDismissNotification(n.id)}
              >
                Dismiss
              </button>
            </div>
          </li>
        ))}
      </ul>

      <hr className="my-4 border-gray-300" />

      {/* Add Incident Form */}
      <div>
        <h3 className="font-bold text-lg mb-2">Add Incident</h3>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Title"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newIncident.title}
            onChange={e => setNewIncident({ ...newIncident, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newIncident.description}
            onChange={e => setNewIncident({ ...newIncident, description: e.target.value })}
            required
          />
          <select
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newIncident.severity}
            onChange={e => setNewIncident({ ...newIncident, severity: e.target.value as 'high' | 'medium' | 'low' })}
            required
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newIncident.type}
            onChange={e => setNewIncident({ ...newIncident, type: e.target.value as 'emergency' | 'warning' })}
            required
          >
            <option value="emergency">Emergency</option>
            <option value="warning">Warning</option>
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Latitude"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
              value={newIncident.location.lat}
              onChange={e => setNewIncident({ ...newIncident, location: { ...newIncident.location, lat: Number(e.target.value) } })}
              required
            />
            <input
              type="number"
              placeholder="Longitude"
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-1/2"
              value={newIncident.location.lng}
              onChange={e => setNewIncident({ ...newIncident, location: { ...newIncident.location, lng: Number(e.target.value) } })}
              required
            />
          </div>
          <input
            type="text"
            placeholder="Reported By"
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newIncident.reportedBy}
            onChange={e => setNewIncident({ ...newIncident, reportedBy: e.target.value })}
            required
          />
          <select
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newIncident.status}
            onChange={e => setNewIncident({ ...newIncident, status: e.target.value as 'active' | 'resolved' })}
            required
          >
            <option value="active">Active</option>
            <option value="resolved">Resolved</option>
          </select>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Add Incident
          </button>
        </form>
      </div>
    </div>
  );
};

export default Sidebar;
