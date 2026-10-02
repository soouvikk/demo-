import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HomeView } from './components/public/HomeView';
import { ProductsView } from './components/public/ProductsView';
import { OffersView } from './components/public/OffersView';
import { NotesView } from './components/public/NotesView';
import { ContactView } from './components/public/ContactView';
import { InterestedModal } from './components/public/InterestedModal';
import { ProductDetailModal } from './components/public/ProductDetailModal';
import { AdminLayoutShell } from './components/admin/AdminLayoutShell';

const MainLayout: React.FC = () => {
  const { mode, activePublicPage } = useApp();

  if (mode === 'admin') {
    return <AdminLayoutShell />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Public Content Shell */}
      <main className="flex-1">
        {activePublicPage === 'home' && <HomeView />}
        {activePublicPage === 'products' && <ProductsView />}
        {activePublicPage === 'offers' && <OffersView />}
        {activePublicPage === 'notes' && <NotesView />}
        {activePublicPage === 'contact' && <ContactView />}
      </main>

      {/* Public Footer */}
      <Footer />

      {/* Global Modals */}
      <InterestedModal />
      <ProductDetailModal />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
