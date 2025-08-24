import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './contexts/AppContext';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import LoadingScreen from './components/Layout/LoadingScreen';
import ReceiptModal from './components/PDV/ReceiptModal';

// Lazy load components for better performance
const Dashboard = React.lazy(() => import('./components/Dashboard/Dashboard'));
const PDV = React.lazy(() => import('./components/PDV/PDV'));
const Products = React.lazy(() => import('./components/Products/Products'));
const Clients = React.lazy(() => import('./components/Clients/Clients'));
const Sales = React.lazy(() => import('./components/Sales/Sales'));
const Exchanges = React.lazy(() => import('./components/Exchanges/Exchanges'));
const Labels = React.lazy(() => import('./components/Labels/Labels'));
const CompanySettings = React.lazy(() => import('./components/Settings/CompanySettings'));

// Component wrapper to access context
function AppContent() {
  const { darkMode, loading, lastCompletedSale, dispatch } = useApp();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    if (lastCompletedSale) {
      setIsReceiptModalOpen(true);
    }
  }, [lastCompletedSale]);

  const closeReceiptModal = () => {
    setIsReceiptModalOpen(false);
    dispatch({ type: 'SET_LAST_COMPLETED_SALE', payload: null });
  };

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'pdv':
        return <PDV />;
      case 'products':
        return <Products />;
      case 'clients':
        return <Clients />;
      case 'sales':
        return <Sales />;
      case 'exchanges':
        return <Exchanges />;
      case 'labels':
        return <Labels />;
      case 'company':
        return <CompanySettings />;
      case 'settings':
        return <div>Configurações Gerais em desenvolvimento...</div>;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
      <Sidebar 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isCollapsed={sidebarCollapsed}
        darkMode={darkMode}
      />
      
      <Header 
        toggleSidebar={toggleSidebar}
        isCollapsed={sidebarCollapsed}
      />
      
      <main 
        className="pt-20 pb-6 px-6 transition-all duration-300"
        style={{
          marginLeft: sidebarCollapsed ? '4rem' : '16rem'
        }}
      >
        <React.Suspense fallback={<LoadingScreen />}>
          {renderContent()}
        </React.Suspense>
      </main>

      {isReceiptModalOpen && lastCompletedSale && (
        <ReceiptModal sale={lastCompletedSale} onClose={closeReceiptModal} />
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          className: darkMode ? 'dark' : '',
          style: {
            background: darkMode ? '#1f2937' : '#f9fafb',
            color: darkMode ? '#f9fafb' : '#1f2937',
            boxShadow: darkMode 
              ? '8px 8px 16px #1a1a1a, -8px -8px 16px #2e2e2e'
              : '8px 8px 16px #bebebe, -8px -8px 16px #ffffff'
          }
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
