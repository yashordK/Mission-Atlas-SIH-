import React from 'react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type?: string;
}

interface NotificationPanelProps {
  notifications?: NotificationItem[];
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications = [] }) => {
  if (notifications.length === 0) {
    return (
      <div style={{ backgroundColor: '#141414', border: '1px solid #2A2A2A', borderRadius: '12px', padding: '16px' }}>
        <p style={{ color: '#4B5563', fontSize: '13px' }}>No notifications</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {notifications.map(n => {
        const isPanic = n.title.includes('PANIC') || n.title.includes('SOS');
        const hashMatch = n.message.match(/0x[a-fA-F0-9]{10,}/);

        return (
          <div key={n.id} style={{
            backgroundColor: isPanic ? 'rgba(220,38,38,0.1)' : '#1C1C1C',
            border: isPanic ? '1px solid rgba(220,38,38,0.3)' : '1px solid #2A2A2A',
            borderRadius: '12px',
            padding: '12px',
          }}>
            <p style={{ fontWeight: 600, fontSize: '13px', color: isPanic ? '#EF4444' : '#FFFFFF', marginBottom: '3px' }}>
              {n.title}
            </p>
            <p style={{ fontSize: '12px', color: '#9CA3AF', lineHeight: 1.5, marginBottom: '4px' }}>
              {n.message}
            </p>
            {hashMatch && (
              <p style={{ fontFamily: 'monospace', color: '#4B5563', fontSize: '11px', marginBottom: '4px', wordBreak: 'break-all' }}>
                {hashMatch[0]}
              </p>
            )}
            <p style={{ color: '#4B5563', fontSize: '11px' }}>
              {new Date(n.timestamp).toLocaleTimeString()}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationPanel;
