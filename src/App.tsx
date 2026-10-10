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
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-800 p-4">
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-rose-200 max-w-md w-full">
      <h2 className="text-lg font-bold text-rose-700 mb-2">Something went wrong</h2>
      <p className="text-sm text-slate-600 mb-4 font-mono overflow-auto text-wrap">{error.message}</p>
      <button 
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm hover:bg-emerald-700 transition-colors"
      >
        Try again
      </button>
    </div>
  </div>
);

const FullPageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
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
      <Suspense fallback={<FullPageLoader />}>
        <LandingHero onExploreDashboard={handleExploreDashboard} />
      </Suspense>
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

        <main className="flex-1 overflow-y-auto relative">
          <ErrorBoundary FallbackComponent={FallbackComponent}>
            <Suspense fallback={
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50/50 backdrop-blur-sm z-10">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
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
