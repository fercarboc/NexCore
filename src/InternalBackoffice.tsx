import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sidebar, Header } from './internal-backoffice/layout/Layout';
import { LoginPage } from './internal-backoffice/pages/LoginPage';
import { DashboardPage } from './internal-backoffice/pages/DashboardPage';
import { ClientsPage } from './internal-backoffice/pages/ClientsPage';
import { ClientDetailPage } from './internal-backoffice/pages/ClientDetailPage';
import { SubscriptionsPage } from './internal-backoffice/pages/SubscriptionsPage';
import { PlansPage } from './internal-backoffice/pages/PlansPage';
import { BillingPage } from './internal-backoffice/pages/BillingPage';
import { IntegrationsPage } from './internal-backoffice/pages/IntegrationsPage';
import { SupportPage } from './internal-backoffice/pages/SupportPage';
import { ConfigPage } from './internal-backoffice/pages/ConfigPage';
import { ApiPage, MetricsPage, InboxPage } from './internal-backoffice/pages/OtherPages';
import { InternalSection } from './internal-backoffice/types/common';
import type { SaaSClientWithDetails } from './internal-backoffice/types/clients';
import { supabase } from './lib/supabase';

interface InternalBackofficeProps {
  onLogout?: () => void;
}

const InternalBackoffice = ({ onLogout }: InternalBackofficeProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = checking
  const [activeSection, setActiveSection] = useState<InternalSection>('dashboard');
  const [selectedClient, setSelectedClient] = useState<SaaSClientWithDetails | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    onLogout?.();
  };

  if (isLoggedIn === null) return null; // splash mínimo mientras comprueba sesión

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardPage />;
      case 'clientes':
        if (selectedClient) {
          return <ClientDetailPage client={selectedClient} onBack={() => setSelectedClient(null)} />;
        }
        return <ClientsPage onSelectClient={setSelectedClient} />;
      case 'suscripciones':
        return <SubscriptionsPage />;
      case 'planes':
        return <PlansPage />;
      case 'facturacion':
        return <BillingPage />;
      case 'integraciones':
        return <IntegrationsPage />;
      case 'api':
        return <ApiPage />;
      case 'metricas':
        return <MetricsPage />;
      case 'soporte':
        return <SupportPage />;
      case 'inbox':
        return <InboxPage />;
      case 'configuracion':
        return <ConfigPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={(section) => {
          setActiveSection(section);
          setSelectedClient(null); // Reset client selection when changing sections
        }} 
        onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header />

        <div className="p-8 max-w-7xl mx-auto w-full">
          <motion.div
            key={activeSection + (selectedClient ? `-${selectedClient.id}` : '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default InternalBackoffice;
