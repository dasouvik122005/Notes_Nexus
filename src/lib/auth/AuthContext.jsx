'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const AuthContext = createContext({
  user: null,
  profile: null,
  isLoading: true,
  isAuthModalOpen: false,
  authPromptMessage: '',
  openAuthModal: () => {},
  closeAuthModal: () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPromptMessage, setAuthPromptMessage] = useState('');

  const supabase = createClient();

  const openAuthModal = useCallback((message = '') => {
    setAuthPromptMessage(message);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthPromptMessage('');
  }, []);

  // Fetch or mock profile from DB
  const loadProfile = useCallback(async (sessionUser) => {
    if (!sessionUser) {
      setProfile(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'kumaresh2106@gmail.com,dasouvik122005@gmail.com')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      const isAdmin = adminEmails.includes(sessionUser.email?.toLowerCase());

      if (!error && data) {
        if (isAdmin && (data.role !== 'admin' || data.account_status !== 'verified')) {
          data.role = 'admin';
          data.account_status = 'verified';
        }
        setProfile(data);
      } else {
        // Fallback profile if DB row doesn't exist yet
        setProfile({
          id: sessionUser.id,
          email: sessionUser.email || 'student@jisuniversity.ac.in',
          name: sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'Student Contributor',
          avatar_url: sessionUser.user_metadata?.avatar_url || null,
          role: isAdmin ? 'admin' : 'contributor',
          account_status: 'verified',
        });
      }
    } catch {
      const adminEmails = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'kumaresh2106@gmail.com,dasouvik122005@gmail.com')
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      const isAdmin = adminEmails.includes(sessionUser.email?.toLowerCase());

      setProfile({
        id: sessionUser.id,
        email: sessionUser.email || 'student@jisuniversity.ac.in',
        name: sessionUser.user_metadata?.full_name || 'Student Contributor',
        avatar_url: sessionUser.user_metadata?.avatar_url || null,
        role: isAdmin ? 'admin' : 'contributor',
        account_status: 'verified',
      });
    }
  }, [supabase]);

  // Check initial session & subscribe to auth state changes
  useEffect(() => {
    async function initAuth() {
      try {
        if (typeof window !== 'undefined' && window.location.search.includes('code=')) {
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
          if (code) {
            const { data, error } = await supabase.auth.exchangeCodeForSession(code);
            if (!error && data?.session) {
              setUser(data.session.user);
              await loadProfile(data.session.user);
              const cleanUrl = window.location.pathname;
              window.history.replaceState({}, document.title, cleanUrl);
              return;
            }
          }
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user);
        }
      } catch (err) {
        console.warn('[Auth] Supabase session check error:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await loadProfile(session.user);
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  // Sign in with Google OAuth
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      console.error('[Auth] Google OAuth sign-in error:', err);
      throw err;
    }
  };

  // Sign out
  const signOut = async () => {
    setUser(null);
    setProfile(null);
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthModalOpen,
        authPromptMessage,
        openAuthModal,
        closeAuthModal,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
