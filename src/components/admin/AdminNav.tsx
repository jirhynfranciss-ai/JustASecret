import React from 'react';
import { Button } from '@/components/ui/Button';

type AdminPage = 'dashboard' | 'responses' | 'questions' | 'analytics' | 'settings';

interface AdminNavProps {
  currentPage: AdminPage;
  onPageChange: (page: AdminPage) => void;
  onLogout: () => void;
}

const navItems: { label: string; page: AdminPage; icon: string }[] = [
  { label: 'Dashboard', page: 'dashboard', icon: '📊' },
  { label: 'Responses', page: 'responses', icon: '📋' },
  { label: 'Questions', page: 'questions', icon: '❓' },
  { label: 'Analytics', page: 'analytics', icon: '📈' },
  { label: 'Settings', page: 'settings', icon: '⚙️' },
];

export const AdminNav: React.FC<AdminNavProps> = ({
  currentPage,
  onPageChange,
  onLogout,
}) => {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 shadow-sm p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your questionnaire</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onPageChange(item.page)}
            className={`w-full px-4 py-3 rounded-lg text-left font-medium transition-all ${
              currentPage === item.page
                ? 'bg-rose-100 text-rose-900'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span className="mr-3">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <Button
        onClick={onLogout}
        variant="secondary"
        size="md"
        className="w-full"
      >
        Logout
      </Button>
    </aside>
  );
};
