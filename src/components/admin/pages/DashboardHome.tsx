import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalResponses: number;
  responsesToday: number;
  responsesThisWeek: number;
  completionRate: number;
  totalQuestions: number;
  activeQuestions: number;
}

export const DashboardHome: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalResponses: 0,
    responsesToday: 0,
    responsesThisWeek: 0,
    completionRate: 0,
    totalQuestions: 0,
    activeQuestions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get total responses
        const { count: totalCount } = await supabase
          .from('responses')
          .select('*', { count: 'exact', head: true });

        // Get responses today
        const today = new Date().toISOString().split('T')[0];
        const { count: todayCount } = await supabase
          .from('responses')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', `${today}T00:00:00`)
          .lte('created_at', `${today}T23:59:59`);

        // Get responses this week
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0];
        const { count: weekCount } = await supabase
          .from('responses')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', `${weekAgo}T00:00:00`);

        // Get questions
        const { data: allQuestions } = await supabase
          .from('questions')
          .select('id, is_active');

        const totalQuestions = allQuestions?.length || 0;
        const activeQuestions = allQuestions?.filter((q) => q.is_active).length || 0;

        setStats({
          totalResponses: totalCount || 0,
          responsesToday: todayCount || 0,
          responsesThisWeek: weekCount || 0,
          completionRate: 100,
          totalQuestions,
          activeQuestions,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const StatCard = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: number | string;
    icon: string;
  }) => (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back! Here's your questionnaire overview.</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-slate-600">Loading statistics...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard
            label="Total Responses"
            value={stats.totalResponses}
            icon="📋"
          />
          <StatCard
            label="Responses Today"
            value={stats.responsesToday}
            icon="📅"
          />
          <StatCard
            label="This Week"
            value={stats.responsesThisWeek}
            icon="📊"
          />
          <StatCard
            label="Total Questions"
            value={stats.totalQuestions}
            icon="❓"
          />
          <StatCard
            label="Active Questions"
            value={stats.activeQuestions}
            icon="✓"
          />
          <StatCard
            label="Completion Rate"
            value={`${stats.completionRate}%`}
            icon="📈"
          />
        </div>
      )}

      {/* Welcome message */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg border border-rose-200 p-6">
        <h2 className="text-lg font-bold text-rose-900 mb-2">Get Started</h2>
        <p className="text-rose-700 text-sm">
          Manage your questionnaire by navigating through the sidebar. View responses,
          edit questions, analyze data, and customize your settings.
        </p>
      </div>
    </div>
  );
};
