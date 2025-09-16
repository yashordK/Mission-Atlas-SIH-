import React from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import NotificationPanel from "./components/NotificationPanel";
import PanicButton from "./components/PanicButton";
import LiveMap from "./components/LiveMap";
import SafetyScore from "./components/SafetyScore";
import { Incident } from "./types";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800">
      {/* Sidebar */}
      <Sidebar
        notifications={[]}
        onMarkAsRead={function (id: string): void {
          throw new Error("Function not implemented.");
        }}
        onDismissNotification={function (id: string): void {
          throw new Error("Function not implemented.");
        }}
        onAddIncident={function (
          incidentData: Omit<Incident, "id" | "timestamp">
        ): void {
          throw new Error("Function not implemented.");
        }}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* TopBar */}
        <TopBar userName={""} />

        {/* Content */}
        <div className="flex-1 grid grid-cols-3 gap-6 p-6 overflow-y-auto">
          {/* Left column: notifications */}
          <div className="col-span-1 space-y-6">
            <NotificationPanel />
            <SafetyScore score={0} />
          </div>

          {/* Middle + Right: live map */}
          <div className="col-span-2 flex flex-col gap-6">
            <LiveMap tourists={[]} incidents={[]} />
            <div className="flex justify-end">
              <PanicButton
                onPanic={function (location: { lat: number; lng: number }): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
