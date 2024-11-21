import { create } from 'zustand';
import netlifyIdentity from 'netlify-identity-widget';

interface User {
  email: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    location?: string;
    title?: string;
  };
  app_metadata: {
    roles?: string[];
  };
}

interface AuthState {
  user: User | null;
  initialized: boolean;
  login: () => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  login: () => netlifyIdentity.open('login'),
  logout: () => netlifyIdentity.logout(),
  setUser: (user) => set({ user, initialized: true }),
}));