import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface AnalyticsData {
  totalSubmissions: number;
  dailySubmissions: Record<string, number>;
  mostCommonAnswers: Record<string, { answer: string; count: number }[]>;
}

export const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalSubmissions: 0,
    dailySubmissions: {},
    mostCommonAnswers: {},
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // Get total submissions
      const { count: totalCount } = await supabase
        .from('responses')
        .select('*', { count: 'exact', head: true });

      // Get daily submissions for last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const { data: dailyData } = await supabase
        .from('responses')
        .select('created_at')
        .gte('created_at', `${thirtyDaysAgo}T00:00:00`);

      const dailySubmissions: Record<string, number> = {};
      (dailyData || []).forEach((item) => {
        const date = new Date(item.created_at).toISOString().split('T')[0];
        dailySubmissions[date] = (dailySubmissions[date] || 0) + 1;
      });

      setAnalytics({
        totalSubmissions: totalCount || 0,
        dailySubmissions,
        mostCommonAnswers: {},
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
        <p className="text-slate-600 mt-1">View your questionnaire analytics</p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-600">Loading analytics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total submissions */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Total Submissions</h3>
            <p className="text-4xl font-bold text-rose-600">
              {analytics.totalSubmissions}
            </p>
          </div>

          {/* Daily submissions chart */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Submissions (Last 30 Days)</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {Object.entries(analytics.dailySubmissions)
                .reverse()
                .slice(0, 10)
                .map(([date, count]) => (
                  <div key={date} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">{date}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              (count / Object.values(analytics.dailySubmissions).reduce((a, b) => Math.max(a, b), 1)) *
                              100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-slate-900 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
