'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { api } from '@/src/lib/api';
import { refreshAdmin } from '../admin/api/admin.api';
import { logoutAdmin } from '../admin/api/admin.api';

type Admin = {
  id: string;
  email: string;
};

type AdminAuthState = {
  accessToken: string | null;
  admin: Admin | null;
  isRestoring: boolean;
};

type AdminAuthContextType = {
  auth: AdminAuthState;
  loginSuccess: (data: {
    accessToken: string;
    admin: Admin;
  }) => void;
  logout: () => Promise<void>;
};

const AdminAuthContext =
  createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [auth, setAuth] = useState<AdminAuthState>({
    accessToken: null,
    admin: null,
    isRestoring: true,
  });

  const tokenRef = useRef<string | null>(null);
  const refreshingRef = useRef<Promise<string> | null>(null);

  useEffect(() => {
    tokenRef.current = auth.accessToken;
  }, [auth.accessToken]);

  /**
   * Interceptor
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
          original?.url?.includes('/admin/login') ||
          original?.url?.includes('/admin/refresh')
        ) {
          return Promise.reject(error);
        }

        original._retry = true;

        try {
          if (!refreshingRef.current) {
            refreshingRef.current = refreshAdmin().then(res => {
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
            admin: null,
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
   * Restore session
   */
useEffect(() => {
  let cancelled = false;

  (async () => {
    // If already logged in via loginSuccess, don't restore
    if (tokenRef.current) {
      setAuth(prev => ({
        ...prev,
        isRestoring: false,
      }));
      return;
    }

    try {
      const refreshRes = await refreshAdmin();
      tokenRef.current = refreshRes.accessToken;

      const profile = await api.get('/staff/public/auth/admin/me');

      if (cancelled) return;

      setAuth({
        accessToken: refreshRes.accessToken,
        admin: profile.data,
        isRestoring: false,
      });
    } catch {
      if (cancelled) return;

      setAuth({
        accessToken: null,
        admin: null,
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
    admin: Admin;
  }) {
    tokenRef.current = data.accessToken;

    setAuth({
      accessToken: data.accessToken,
      admin: data.admin,
      isRestoring: false,
    });
  }

async function logout() {
  try {
    await logoutAdmin();
  } catch {}

  tokenRef.current = null;

  setAuth({
    accessToken: null,
    admin: null,
    isRestoring: false,
  });
}

  return (
    <AdminAuthContext.Provider value={{ auth, loginSuccess, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used inside AdminAuthProvider');
  }
  return ctx;
}