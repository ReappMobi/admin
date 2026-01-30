import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AccountType = 'ADMIN' | 'INSTITUTION' | 'DONOR';

export interface User {
  id: number;
  email: string;
  name: string;
  accountType: AccountType;
  media?: {
    remoteUrl: string;
  } | null;
  status?: string;
}

interface TokenPayload {
  exp: number;
  iat: number;
}

type Token = string | null;

interface AuthStoreState {
  token: Token;
  user: User | null;
}

interface AuthStoreActions {
  isLogged: () => boolean;
  login: (token: Token, user: User) => void;
  logout: () => void;
  getUser: () => User | null;
}

export type AuthStore = AuthStoreState & AuthStoreActions;

const isTokenValid = (token: Token): boolean => {
  if (!token) return false;
  try {
    const { exp } = jwtDecode<TokenPayload>(token);
    return exp > Date.now() / 1000;
  } catch {
    return false;
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      getUser() {
        return get().user;
      },
      isLogged() {
        const { token } = get();
        return !!token && isTokenValid(token);
      },
      login(token, user) {
        if (token && isTokenValid(token)) {
          set({ token, user });
        }
      },
      logout() {
        set({ token: null, user: null });
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage(state) {
        if (state) {
          const { token } = state;
          if (token && !isTokenValid(token)) {
            state.logout();
          }
        }
      },
    },
  ),
);
