import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import type { Session, User, AuthError, SignInWithPasswordCredentials } from '@supabase/supabase-js';
import { authService } from '@/lib/authService';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  initializing: boolean;
  loading: boolean;
  error: string | null;
  signInWithPassword: (credentials: SignInWithPasswordCredentials) => Promise<AuthError | null>;
  signOut: () => Promise<AuthError | null>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthStateChange = useCallback((nextSession: Session | null) => {
    setSession(nextSession);
    setUser(nextSession?.user ?? null);
  }, []);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: NodeJS.Timeout | null = null;
    let isProcessingAuth = false;
    let authSubscription: any = null;

    const bootstrap = async (retryCount = 0) => {
      if (isProcessingAuth) {
        console.log('⚠️ Auth already processing, skipping...');
        return;
      }

      isProcessingAuth = true;
      setInitializing(true);
      setError(null);

      // Safety timeout to ensure app never hangs on loading screen indefinitely
      const safetyTimer = setTimeout(() => {
        if (isMounted) {
          console.warn('⚠️ Auth bootstrap safety timeout triggered - completing initialization');
          setInitializing(false);
          setLoading(false);
          isProcessingAuth = false;
        }
      }, 3000);

      try {
        const {
          data: { session: initialSession },
          error: sessionError,
        } = await authService.getSession();

        if (!isMounted) {
          return;
        }

        if (sessionError) {
          console.error('AuthContext bootstrap error:', sessionError);

          const is429Error = sessionError.message?.includes('429') ||
            sessionError.message?.toLowerCase().includes('too many requests') ||
            sessionError.message?.toLowerCase().includes('rate limit');

          if (is429Error && retryCount < 3) {
            const backoffTime = Math.min(5000 * Math.pow(2, retryCount), 30000);
            console.warn(`⚠️ Rate limit error detected. Retrying in ${backoffTime}ms (attempt ${retryCount + 1}/3)`);
            setError(`Terlalu banyak permintaan. Mencoba ulang dalam ${Math.round(backoffTime / 1000)} detik...`);

            retryTimeout = setTimeout(() => {
              if (isMounted) {
                isProcessingAuth = false;
                bootstrap(retryCount + 1);
              }
            }, backoffTime);
            return;
          }

          if (is429Error) {
            setError('Server sedang sibuk. Silakan muat ulang halaman dalam beberapa saat.');
          } else {
            setError(sessionError.message ?? 'Gagal mengambil sesi');
          }
          handleAuthStateChange(null);
        } else {
          handleAuthStateChange(initialSession);
        }
      } catch (err: any) {
        console.error('AuthContext bootstrap exception:', err);
        handleAuthStateChange(null);
      } finally {
        clearTimeout(safetyTimer);
        if (isMounted) {
          setInitializing(false);
          setLoading(false);
          isProcessingAuth = false;
        }
      }
    };

    bootstrap();

    // Subscribe to auth changes - ONLY for critical events
    const {
      data: { subscription },
    } = authService.onAuthStateChange(async (event, nextSession) => {
      if (!isMounted) {
        return;
      }

      // ONLY handle critical events - ignore TOKEN_REFRESHED completely
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        console.log('Auth event:', event);
        handleAuthStateChange(nextSession);
        setError(null);
      } else if (event === 'SIGNED_OUT') {
        console.log('Auth event: SIGNED_OUT');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('supabase-auth-token');
          sessionStorage.removeItem('tenant_id');
          sessionStorage.removeItem('tenant_name');
        }
        handleAuthStateChange(null);
        setError(null);
      }
      // TOKEN_REFRESHED is completely ignored - no logging, no action
    });

    authSubscription = subscription;

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [handleAuthStateChange]);

  const signInWithPassword = useCallback(
    async (credentials: SignInWithPasswordCredentials) => {
      setLoading(true);
      setError(null);

      try {
        const { data, error: authError } = await authService.signInWithPassword(credentials);

        if (authError) {
          setError(authError.message ?? 'Gagal masuk');
          setLoading(false);
          return authError;
        }

        if (data?.session) {
          handleAuthStateChange(data.session);
        }

        setLoading(false);
        return null;
      } catch (error: any) {
        console.error('Login error:', error);
        setError(error.message ?? 'Terjadi kesalahan saat login');
        setLoading(false);
        return error;
      }
    },
    [handleAuthStateChange]
  );

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { error: authError } = await authService.signOut();
    if (authError) {
      setError(authError.message ?? 'Gagal keluar');
    }

    if (!authError) {
      handleAuthStateChange(null);
    }

    setLoading(false);
    return authError;
  }, [handleAuthStateChange]);

  const refreshSession = useCallback(async () => {
    setLoading(true);

    try {
      const {
        data: { session: refreshedSession },
        error: refreshError,
      } = await authService.getSession();

      if (refreshError) {
        console.error('AuthContext refresh error:', refreshError);

        // Deteksi 429 error
        const is429Error = refreshError.message?.includes('429') ||
          refreshError.message?.toLowerCase().includes('too many requests') ||
          refreshError.message?.toLowerCase().includes('rate limit');

        if (is429Error) {
          setError('Server sedang sibuk. Silakan tunggu beberapa saat sebelum mencoba lagi.');
          // Jangan clear session untuk 429 errors
          setLoading(false);
          return;
        }

        setError(refreshError.message ?? 'Gagal memperbarui sesi');
      } else {
        setError(null);
        handleAuthStateChange(refreshedSession);
      }
    } catch (error) {
      console.error('Unexpected error during refresh:', error);
      setError('Terjadi kesalahan saat memperbarui sesi');
    } finally {
      setLoading(false);
    }
  }, [handleAuthStateChange]);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      initializing,
      loading,
      error,
      signInWithPassword,
      signOut,
      refreshSession,
    }),
    [session, user, initializing, loading, error, signInWithPassword, signOut, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus dipakai di dalam AuthProvider');
  }
  return context;
};

