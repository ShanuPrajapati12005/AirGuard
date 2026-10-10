import React, { useState } from 'react';
import { AirGuardProvider, useAirGuard } from './context/AirGuardContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MainDashboard } from './pages/MainDashboard';
import { LandingHero } from './components/LandingHero';
import { SettingsModal } from './components/SettingsModal';
import { LocationModal } from './components/LocationModal';

const AppContent: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const handleExploreDashboard = () => {
    setShowLanding(false);
  };

  if (showLanding) {
    return (
      <LandingHero
        onExploreDashboard={handleExploreDashboard}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Persistent Sidebar */}
      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenLocation={() => setIsLocationOpen(true)}
        />

        <main className="flex-1 overflow-y-auto">
          <MainDashboard />
        </main>
      </div>

      {/* User Profile & API Key Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Location Selector Modal */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AirGuardProvider>
      <AppContent />
    </AirGuardProvider>
  );
}
