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
import { MobileBottomBar } from './components/common/MobileBottomBar';

const MainLayout: React.FC = () => {
  const { mode, activePublicPage } = useApp();

  if (mode === 'admin') {
    return (
      <>
        <AdminLayoutShell />
        <MobileBottomBar />
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#20261D] font-sans selection:bg-[#7D8D64] selection:text-white pb-16 md:pb-0">
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

      {/* Mobile Sticky Bottom Navigation */}
      <MobileBottomBar />

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
