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
  setDemoUser: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedDemo = sessionStorage.getItem('notes_nexus_demo_user');
      if (savedDemo) {
        try {
          return JSON.parse(savedDemo).user;
        } catch {
          sessionStorage.removeItem('notes_nexus_demo_user');
        }
      }
    }
    return null;
  });

  const [profile, setProfile] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedDemo = sessionStorage.getItem('notes_nexus_demo_user');
      if (savedDemo) {
        try {
          return JSON.parse(savedDemo).profile;
        } catch {
          // ignore
        }
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('notes_nexus_demo_user')) {
      return false;
    }
    return true;
  });
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

      if (!error && data) {
        setProfile(data);
      } else {
        // Fallback profile if DB row doesn't exist yet
        setProfile({
          id: sessionUser.id,
          email: sessionUser.email || 'student@jisuniversity.ac.in',
          name: sessionUser.user_metadata?.full_name || sessionUser.email?.split('@')[0] || 'Student Contributor',
          avatar_url: sessionUser.user_metadata?.avatar_url || null,
          role: 'contributor',
          account_status: 'verified',
        });
      }
    } catch {
      setProfile({
        id: sessionUser.id,
        email: sessionUser.email || 'student@jisuniversity.ac.in',
        name: sessionUser.user_metadata?.full_name || 'Student Contributor',
        avatar_url: sessionUser.user_metadata?.avatar_url || null,
        role: 'contributor',
        account_status: 'verified',
      });
    }
  }, [supabase]);

  // Check initial session & subscribe to auth state changes
  useEffect(() => {
    // If demo user is already active, skip initial fetch
    if (typeof window !== 'undefined' && sessionStorage.getItem('notes_nexus_demo_user')) {
      return;
    }

    async function initAuth() {
      try {
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
          // Only clear if not demo user
          if (typeof window !== 'undefined' && !sessionStorage.getItem('notes_nexus_demo_user')) {
            setUser(null);
            setProfile(null);
          }
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
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('notes_nexus_demo_user');
    }
    setUser(null);
    setProfile(null);
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
  };

  // Set demo user for offline / local testing
  const setDemoUser = (type) => {
    let mockUser;
    let mockProfile;

    if (type === 'admin') {
      mockUser = { id: 'demo-admin-id', email: 'kumaresh2106@gmail.com' };
      mockProfile = {
        id: 'demo-admin-id',
        email: 'kumaresh2106@gmail.com',
        name: 'Kumaresh Jana (Admin)',
        avatar_url: null,
        role: 'admin',
        account_status: 'verified',
      };
    } else if (type === 'pending') {
      mockUser = { id: 'demo-pending-id', email: 'newstudent@gmail.com' };
      mockProfile = {
        id: 'demo-pending-id',
        email: 'newstudent@gmail.com',
        name: 'Alex Rivera (New Student)',
        avatar_url: null,
        role: 'contributor',
        account_status: 'pending',
      };
    } else {
      // Verified Contributor
      mockUser = { id: 'demo-contributor-id', email: 'souvik.das@gmail.com' };
      mockProfile = {
        id: 'demo-contributor-id',
        email: 'souvik.das@gmail.com',
        name: 'Souvik Das',
        avatar_url: null,
        role: 'contributor',
        account_status: 'verified',
      };
    }

    setUser(mockUser);
    setProfile(mockProfile);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('notes_nexus_demo_user', JSON.stringify({ user: mockUser, profile: mockProfile }));
    }
    closeAuthModal();
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
        setDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
