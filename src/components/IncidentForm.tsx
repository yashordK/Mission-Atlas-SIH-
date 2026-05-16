import React, { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Incident } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface IncidentFormProps {
  onAddIncident: (incident: Omit<Incident, 'id' | 'timestamp'>) => void;
}

const IncidentForm: React.FC<IncidentFormProps> = ({ onAddIncident }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'warning' as const,
    title: '',
    description: '',
    severity: 'medium' as const,
    location: { lat: 40.7128, lng: -74.0060 },
    reportedBy: 'Authority',
    status: 'active' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() && formData.description.trim()) {
      onAddIncident(formData);
      setFormData({
        type: 'warning',
        title: '',
        description: '',
        severity: 'medium',
        location: { lat: 40.7128, lng: -74.0060 },
        reportedBy: 'Authority',
        status: 'active'
      });
      setIsOpen(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
      >
        <PlusIcon className="w-5 h-5" />
        <span>{t('addIncident')}</span>
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 w-80">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('addIncident')}</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Severity
          </label>
          <select
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Incident title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
            placeholder="Describe the incident"
            required
          />
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Add Incident
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncidentForm;