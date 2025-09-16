import React from "react";

const NotificationPanel = () => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="font-semibold text-lg mb-3">Notifications</h2>
      <ul className="space-y-2 text-gray-600">
        <li>- New tourist alert near Central Park</li>
        <li>- Panic button pressed in Sector 5</li>
        <li>- Map update available</li>
      </ul>
    </div>
  );
};

export default NotificationPanel;
