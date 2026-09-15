import React, { useState } from 'react';
import { DisasterProvider, useDisaster } from './context/DisasterContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { MapViewPage } from './pages/MapViewPage';
import { ReportsPage } from './pages/ReportsPage';
import { AlertsPage } from './pages/AlertsPage';
import { AuthorityDashboardPage } from './pages/AuthorityDashboardPage';

function AppContent() {
  const { activeTab } = useDisaster();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'analysis':
        return <RiskAnalysisPage />;
      case 'map':
        return <MapViewPage />;
      case 'reports':
        return <ReportsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'authority':
        return <AuthorityDashboardPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-command-950 overflow-hidden font-sans text-slate-100">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
          onMobileMenuToggle={() => setMobileMenuOpen(true)}
        />

        {/* Dynamic Main Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 md:pb-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <MobileNav
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <DisasterProvider>
      <AppContent />
    </DisasterProvider>
  );
}
