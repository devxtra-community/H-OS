'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { api } from '../../lib/api';
import { Staff } from './staff.auth.types';
import { refreshStaff } from './staff.auth.service';

type StaffAuthState = {
  accessToken: string | null;
  staff: Staff | null;
  isRestoring: boolean;
};

type StaffAuthContextType = {
  auth: StaffAuthState;
  loginSuccess: (data: {
    accessToken: string;
    staff: Staff;
  }) => void;
  logout: () => Promise<void>;
};

const StaffAuthContext = createContext<StaffAuthContextType | null>(null);

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StaffAuthState>({
    accessToken: null,
    staff: null,
    isRestoring: true,
  });

  const tokenRef = useRef<string | null>(null);
  const refreshingRef = useRef<Promise<string> | null>(null);

  useEffect(() => {
    tokenRef.current = auth.accessToken;
  }, [auth.accessToken]);

  /**
   * ✅ Axios interceptor
   */
  useEffect(() => {
    const reqId = api.interceptors.request.use(config => {
      if (tokenRef.current) {
        config.headers.Authorization = `Bearer ${tokenRef.current}`;
      }
      return config;
    });

    const resId = api.interceptors.response.use(
      res => res,
      async error => {
        const original = error.config;

        if (
          error.response?.status !== 401 ||
          original?._retry ||
          original?.url?.includes('/staff/public/auth/login') ||
          original?.url?.includes('/staff/public/auth/refresh')
        ) {
          return Promise.reject(error);
        }

        original._retry = true;

        try {
          if (!refreshingRef.current) {
            refreshingRef.current = refreshStaff().then(res => {
              tokenRef.current = res.accessToken;
              setAuth(prev => ({
                ...prev,
                accessToken: res.accessToken,
              }));
              refreshingRef.current = null;
              return res.accessToken;
            });
          }

          const newToken = await refreshingRef.current;
          original.headers.Authorization = `Bearer ${newToken}`;
          return api(original);
        } catch {
          refreshingRef.current = null;
          setAuth({
            accessToken: null,
            staff: null,
            isRestoring: false,
          });
          return Promise.reject(error);
        }
      }
    );

    return () => {
      api.interceptors.request.eject(reqId);
      api.interceptors.response.eject(resId);
    };
  }, []);

  /**
   * ✅ Restore session ONCE on mount
   */
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const refreshRes = await refreshStaff();

        tokenRef.current = refreshRes.accessToken;

        const profile = await api.get('/staff/public/auth/me');

        if (cancelled) return;

        setAuth({
          accessToken: refreshRes.accessToken,
          staff: profile.data,
          isRestoring: false,
        });
      } catch {
        if (cancelled) return;

        setAuth({
          accessToken: null,
          staff: null,
          isRestoring: false,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function loginSuccess(data: {
    accessToken: string;
    staff: Staff;
  }) {
    tokenRef.current = data.accessToken;

    setAuth({
      accessToken: data.accessToken,
      staff: data.staff,
      isRestoring: false,
    });
  }

  async function logout() {
    try {
      await api.post('/staff/public/auth/logout');
    } catch {}

    tokenRef.current = null;

    setAuth({
      accessToken: null,
      staff: null,
      isRestoring: false,
    });
  }

  return (
    <StaffAuthContext.Provider value={{ auth, loginSuccess, logout }}>
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  const ctx = useContext(StaffAuthContext);
  if (!ctx) {
    throw new Error('useStaffAuth must be used inside StaffAuthProvider');
  }
  return ctx;
}
