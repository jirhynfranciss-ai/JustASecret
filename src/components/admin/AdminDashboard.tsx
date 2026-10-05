import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AdminNav } from '@/components/admin/AdminNav';
import { DashboardHome } from '@/components/admin/pages/DashboardHome';
import { ResponsesList } from '@/components/admin/pages/ResponsesList';
import { QuestionsList } from '@/components/admin/pages/QuestionsList';
import { Analytics } from '@/components/admin/pages/Analytics';
import { Settings } from '@/components/admin/pages/Settings';

type AdminPage = 'dashboard' | 'responses' | 'questions' | 'analytics' | 'settings';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState<AdminPage>('dashboard');

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome />;
      case 'responses':
        return <ResponsesList />;
      case 'questions':
        return <QuestionsList />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <AdminNav 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};
