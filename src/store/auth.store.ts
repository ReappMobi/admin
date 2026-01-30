import { jwtDecode } from 'jwt-decode';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AccountType = 'ADMIN' | 'INSTITUTION' | 'DONOR';

interface TokenAccount {
  id: number;
  email: string;
  name: string;
  accountType: AccountType;
}

interface TokenPayload {
  exp: number;
  iat: number;
  user: TokenAccount;
}

type Token = string | null;

interface AuthStoreState {
  token: Token;
}

interface AuthStoreActions {
  isLogged: () => boolean;
  login: (token: Token) => void;
  logout: () => void;
  getUser: () => TokenAccount | null;
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
      getUser() {
        const { token } = get();
        if (!token) return null;
        try {
          const { user } = jwtDecode<TokenPayload>(token);
          return user;
        } catch {
          return null;
        }
      },
      isLogged() {
        const { token } = get();
        return !!token && isTokenValid(token);
      },
      login(token) {
        if (token && isTokenValid(token)) {
          set({ token });
        }
      },
      logout() {
        set({ token: null });
        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }),
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
