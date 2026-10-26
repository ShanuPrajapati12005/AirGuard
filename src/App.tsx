import React, { useState, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AirGuardProvider } from './context/AirGuardContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Loader2 } from 'lucide-react';

// Lazy loaded components
const MainDashboard = React.lazy(() => import('./pages/MainDashboard').then(module => ({ default: module.MainDashboard })));
const LandingHero = React.lazy(() => import('./components/LandingHero').then(module => ({ default: module.LandingHero })));
const SettingsModal = React.lazy(() => import('./components/SettingsModal').then(module => ({ default: module.SettingsModal })));
const LocationModal = React.lazy(() => import('./components/LocationModal').then(module => ({ default: module.LocationModal })));
import { Toaster } from 'sonner';

const AirPollutionReportModal = React.lazy(() => import('./components/AirPollutionReportModal').then(module => ({ default: module.AirPollutionReportModal })));
const NotificationCenterModal = React.lazy(() => import('./components/NotificationCenterModal').then(module => ({ default: module.NotificationCenterModal })));

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
  const [showLanding, setShowLanding] = useState<boolean>(() => {
    try {
      // Stay on dashboard if user navigated there, even on page refresh
      const inDashboard = localStorage.getItem('airguard_in_dashboard') === 'true' || 
                          sessionStorage.getItem('airguard_in_dashboard') === 'true';
      return !inDashboard;
    } catch {
      return true;
    }
  });
  const [isFirstTime] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
    try {
      localStorage.setItem('airguard_profile_configured', 'true');
    } catch (e) {
      console.warn('Failed to mark profile configured:', e);
    }
  };

  // Direct, smooth navigation to Dashboard without any blocking popups
  const handleExploreDashboard = () => {
    setShowLanding(false);
    try {
      localStorage.setItem('airguard_in_dashboard', 'true');
      sessionStorage.setItem('airguard_in_dashboard', 'true');
      localStorage.setItem('airguard_profile_configured', 'true');
    } catch {
      // ignore
    }
  };

  const handleGoToLanding = () => {
    setShowLanding(true);
    try {
      localStorage.removeItem('airguard_in_dashboard');
      sessionStorage.removeItem('airguard_in_dashboard');
    } catch {
      // ignore
    }
  };

  if (showLanding) {
    return (
      <div className="relative min-h-screen bg-[var(--bg)] text-[var(--ink)]">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="animated-grid" />
          <div className="animated-pattern" />
        </div>
        <Suspense fallback={<FullPageLoader />}>
          <LandingHero
            onExploreDashboard={handleExploreDashboard}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenLocation={() => setIsLocationOpen(true)}
          />
        </Suspense>

        {/* Global Modals on Landing Page */}
        <ErrorBoundary FallbackComponent={FallbackComponent}>
          <Suspense fallback={null}>
            <SettingsModal
              key={isSettingsOpen ? 'settings-open-landing' : 'settings-closed-landing'}
              isOpen={isSettingsOpen}
              onClose={handleCloseSettings}
              isFirstTime={isFirstTime}
            />
            <LocationModal
              isOpen={isLocationOpen}
              onClose={() => setIsLocationOpen(false)}
            />
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[var(--bg)] text-[var(--ink)] font-sans">
      <div className="animated-grid" />
      <div className="animated-pattern" />

      {/* Persistent Floating Sidebar */}
      <Sidebar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onGoToLanding={handleGoToLanding}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenLocation={() => setIsLocationOpen(true)}
      />

      {/* Main Content Area: Floating Header + Scrolling Body */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden p-2.5 sm:p-3 sm:pl-2 gap-2.5 sm:gap-3 z-10">
        <Header
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenLocation={() => setIsLocationOpen(true)}
          onOpenReport={() => setIsReportOpen(true)}
          onOpenNotification={() => setIsNotificationOpen(true)}
          onGoToLanding={handleGoToLanding}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        <main className="flex-1 min-h-0 overflow-y-auto rounded-[14px]">
          <ErrorBoundary FallbackComponent={FallbackComponent}>
            <Suspense fallback={
              <div className="min-h-[400px] flex items-center justify-center bg-[var(--bg)]/60 backdrop-blur-xs">
                <Loader2 className="w-6 h-6 text-[var(--ac)] animate-spin" />
              </div>
            }>
              <MainDashboard />
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      {/* Modals on Dashboard */}
      <ErrorBoundary FallbackComponent={FallbackComponent}>
        <Suspense fallback={null}>
          <SettingsModal
            key={isSettingsOpen ? 'settings-open-dashboard' : 'settings-closed-dashboard'}
            isOpen={isSettingsOpen}
            onClose={handleCloseSettings}
            isFirstTime={isFirstTime}
          />
          <LocationModal
            isOpen={isLocationOpen}
            onClose={() => setIsLocationOpen(false)}
          />
          <AirPollutionReportModal
            key={isReportOpen ? 'report-open-dashboard' : 'report-closed-dashboard'}
            isOpen={isReportOpen}
            onClose={() => setIsReportOpen(false)}
          />
          <NotificationCenterModal
            isOpen={isNotificationOpen}
            onClose={() => setIsNotificationOpen(false)}
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
        <Toaster position="top-right" richColors />
      </AirGuardProvider>
    </ErrorBoundary>
  );
}
