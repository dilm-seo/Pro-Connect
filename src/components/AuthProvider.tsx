import React, { useEffect } from 'react';
import netlifyIdentity from 'netlify-identity-widget';
import { useAuthStore } from '../store/authStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    netlifyIdentity.init();

    netlifyIdentity.on('login', (user) => {
      netlifyIdentity.close();
      setUser(user);
    });

    netlifyIdentity.on('logout', () => {
      setUser(null);
    });

    netlifyIdentity.on('init', (user) => {
      setUser(user || null);
    });

    return () => {
      netlifyIdentity.off('login');
      netlifyIdentity.off('logout');
      netlifyIdentity.off('init');
    };
  }, [setUser]);

  return <>{children}</>;
}