import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface LandingProps {
  onStart: () => void;
  isLoading: boolean;
}

export const Landing: React.FC<LandingProps> = ({ onStart, isLoading }) => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_settings')
          .select('setting_key, setting_value');

        if (error) throw error;

        const settingsMap: Record<string, string> = {};
        data?.forEach((item) => {
          settingsMap[item.setting_key] = item.setting_value;
        });
        setSettings(settingsMap);
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setLoadingSettings(false);
      }
    };

    fetchSettings();
  }, []);

  const title = settings['website_title'] || 'Can I Get to Know You?';
  const subtitle = settings['website_subtitle'] || 'A little question for you... 💌';
  const message = settings['welcome_message'] || 'I\'ve been curious about you, so I thought I\'d ask a few things.';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-white to-lavender-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-lavender-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-pink-200/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto text-center space-y-8">
        {/* Decorative hearts */}
        <div className="text-4xl animate-pulse">✨</div>

        {/* Title section */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-rose-500 tracking-wide uppercase">
            {subtitle}
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
            {loadingSettings ? 'Loading...' : title}
          </h1>
        </div>

        {/* Description */}
        <p className="text-lg text-slate-600 leading-relaxed">
          {loadingSettings ? 'Preparing something special...' : message}
        </p>

        <p className="text-sm text-slate-500">
          Don't worry... there are no wrong answers. 🤍
        </p>

        {/* CTA Button */}
        <div className="pt-4">
          <Button
            onClick={onStart}
            isLoading={isLoading}
            size="lg"
            className="w-full md:w-auto"
          >
            Start Answering 💗
          </Button>
        </div>

        {/* Footer text */}
        <p className="text-sm text-rose-400">
          It'll only take a minute.
        </p>

        {/* Floating hearts animation */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${4 + i}s ease-in-out infinite`,
              }}
            >
              💗
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.5;
          }
          50% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-100vh) translateX(50px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
