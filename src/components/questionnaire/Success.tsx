import React from 'react';
import { Button } from '@/components/ui/Button';

interface SuccessProps {
  onRestart: () => void;
}

export const Success: React.FC<SuccessProps> = ({ onRestart }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-rose-50 via-white to-lavender-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-lavender-200/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-24 h-24 bg-pink-200/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto text-center space-y-8">
        {/* Celebration animation */}
        <div className="text-6xl mb-4 animate-bounce" style={{ animationDuration: '0.6s' }}>
          💌
        </div>

        {/* Success message */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900">
            It's on its way!
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Thank you for answering my little questions.
          </p>
        </div>

        {/* Closing message */}
        <div className="space-y-2">
          <p className="text-base text-rose-600 font-medium">
            I hope you enjoyed answering them as much as I enjoyed asking.
          </p>
          <p className="text-2xl">♡</p>
        </div>

        {/* Optional restart button */}
        <Button
          onClick={onRestart}
          variant="secondary"
          size="lg"
          className="mt-4"
        >
          Fill it out again
        </Button>

        {/* Floating hearts */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl opacity-30 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${4 + i}s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
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
