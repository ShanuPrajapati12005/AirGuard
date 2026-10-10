import React, { useState, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AirGuardProvider, useAirGuard } from './context/AirGuardContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Loader2 } from 'lucide-react';

// Lazy loaded components
const MainDashboard = React.lazy(() => import('./pages/MainDashboard').then(module => ({ default: module.MainDashboard })));
const LandingHero = React.lazy(() => import('./components/LandingHero').then(module => ({ default: module.LandingHero })));
const SettingsModal = React.lazy(() => import('./components/SettingsModal').then(module => ({ default: module.SettingsModal })));
const LocationModal = React.lazy(() => import('./components/LocationModal').then(module => ({ default: module.LocationModal })));

const FallbackComponent = ({ error, resetErrorBoundary }: any) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg)] text-[var(--ink)] p-4">
    <div className="card p-6 max-w-md w-full border border-rose-200/80 shadow-md">
      <h2 className="text-lg font-medium text-rose-700 mb-2 font-display">Something went wrong</h2>
      <p className="text-xs text-[var(--mut)] mb-4 font-mono overflow-auto">{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="btn p text-xs font-semibold"
      >
        Try again
      </button>
    </div>
  </div>
);

const FullPageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-[var(--bg)]">
    <Loader2 className="w-6 h-6 text-[var(--ac)] animate-spin" />
  </div>
);

const AppContent: React.FC = () => {
  const [showLanding, setShowLanding] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);

  const handleExploreDashboard = () => {
    setShowLanding(false);
  };

  if (showLanding) {
    return (
      <div className="relative min-h-screen bg-[var(--bg)] text-[var(--ink)]">
        <div className="animated-grid" />
        <div className="animated-pattern" />
        <Suspense fallback={<FullPageLoader />}>
          <LandingHero onExploreDashboard={handleExploreDashboard} />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen bg-[var(--bg)] text-[var(--ink)] font-sans">
      <div className="animated-grid" />
      <div className="animated-pattern" />

      {/* Persistent Sidebar */}
      <Sidebar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onGoToLanding={() => setShowLanding(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        <Header
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenLocation={() => setIsLocationOpen(true)}
          onGoToLanding={() => setShowLanding(true)}
        />

        <main className="flex-1 overflow-y-auto relative">
          <ErrorBoundary FallbackComponent={FallbackComponent}>
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]/60 backdrop-blur-xs z-10">
                <Loader2 className="w-6 h-6 text-[var(--ac)] animate-spin" />
              </div>
            }>
              <MainDashboard />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      {/* Modals */}
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <Suspense fallback={null}>
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
          <LocationModal
            isOpen={isLocationOpen}
            onClose={() => setIsLocationOpen(false)}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <AirGuardProvider>
        <AppContent />
      </AirGuardProvider>
    </ErrorBoundary>
  );
}
