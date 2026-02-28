'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { Patient } from './auth.types';
import { refreshPatient } from './auth.service';
import { api } from '../lib/api';
import { logoutPatient } from './auth.service';

type AuthState = {
  accessToken: string | null;
  patient: Patient | null;
  isRestoring: boolean;
};

type AuthContextType = {
  auth: AuthState;
  loginSuccess: (data: {
    accessToken: string;
    patient: Patient;
  }) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    accessToken: null,
    patient: null,
    isRestoring: true,
  });

  const accessTokenRef = useRef<string | null>(null);
  const refreshingRef = useRef<Promise<string> | null>(null);
  const interceptorsInitialized = useRef(false);

  // Keep token ref in sync
  useEffect(() => {
    accessTokenRef.current = auth.accessToken;
  }, [auth.accessToken]);

  // Setup Axios interceptors once
  useEffect(() => {
    if (interceptorsInitialized.current) return;
    interceptorsInitialized.current = true;

    const reqId = api.interceptors.request.use(config => {
      if (accessTokenRef.current) {
        config.headers.Authorization = `Bearer ${accessTokenRef.current}`;
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
          original?.url?.includes('/auth/login') ||
          original?.url?.includes('/auth/register') ||
          original?.url?.includes('/auth/refresh')
        ) {
          return Promise.reject(error);
        }

        original._retry = true;

        try {
          if (!refreshingRef.current) {
            refreshingRef.current = refreshPatient().then(res => {
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
            patient: null,
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

  // 🔁 Restore session on page load
// 🔁 Restore session ONLY if no accessToken
// 🔁 Restore session ONCE on mount
useEffect(() => {
  let cancelled = false;

  (async () => {
    // 🔥 IMPORTANT FIX
    if (accessTokenRef.current) {
      setAuth(prev => ({
        ...prev,
        isRestoring: false,
      }));
      return;
    }

    try {
      const refreshRes = await refreshPatient();

      accessTokenRef.current = refreshRes.accessToken;

      const profileRes = await api.get('/patients/public/auth/me');

      if (cancelled) return;

      setAuth({
        accessToken: refreshRes.accessToken,
        patient: profileRes.data,
        isRestoring: false,
      });
    } catch {
      if (cancelled) return;

      setAuth({
        accessToken: null,
        patient: null,
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
  patient: Patient;
}) {
  accessTokenRef.current = data.accessToken; // 🔥 ADD THIS LINE

  setAuth({
    accessToken: data.accessToken,
    patient: data.patient,
    isRestoring: false,
  });
}

async function logout() {
  try {
    await logoutPatient();
  } catch {}

  setAuth({
    accessToken: null,
    patient: null,
    isRestoring: false,
  });
}


  return (
    <AuthContext.Provider value={{ auth, loginSuccess, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
