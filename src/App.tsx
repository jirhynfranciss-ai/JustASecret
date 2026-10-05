import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { QuestionnairePageComponent } from '@/pages/Questionnaire';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { AuthUser } from '@/types';

type AppState = 'questionnaire' | 'admin-login' | 'admin-dashboard';

export default function App() {
  const [appState, setAppState] = useState<AppState>('questionnaire');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          setCurrentUser({
            id: user.id,
            email: user.email || '',
            user_metadata: user.user_metadata,
          });
          setAppState('admin-dashboard');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || '',
          user_metadata: session.user.user_metadata,
        });
        setAppState('admin-dashboard');
      } else {
        setCurrentUser(null);
        setAppState('questionnaire');
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Global keyboard shortcut for admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A for admin access (but not if typing in input)
      if (
        e.altKey &&
        e.key.toLowerCase() === 'a' &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        if (appState === 'questionnaire') {
          setAppState('admin-login');
        } else {
          setAppState('questionnaire');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [appState]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-lavender-50">
        <div className="text-center space-y-4">
          <p className="text-2xl">✨</p>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {appState === 'questionnaire' && <QuestionnairePageComponent />}
      {appState === 'admin-login' && (
        <AdminLogin
          onLoginSuccess={() => setAppState('admin-dashboard')}
        />
      )}
      {appState === 'admin-dashboard' && currentUser && (
        <AdminDashboard
          onLogout={() => {
            setCurrentUser(null);
            setAppState('questionnaire');
          }}
        />
      )}
    </>
  );
}
