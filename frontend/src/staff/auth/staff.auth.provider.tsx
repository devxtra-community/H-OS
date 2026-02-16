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

const StaffAuthContext = createContext<any>(null);

export function StaffAuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StaffAuthState>({
    accessToken: null,
    staff: null,
    isRestoring: true,
  });

  const tokenRef = useRef<string | null>(null);

  useEffect(() => {
    tokenRef.current = auth.accessToken;
  }, [auth.accessToken]);

  useEffect(() => {
    const reqId = api.interceptors.request.use(config => {
      if (tokenRef.current) {
        config.headers.Authorization = `Bearer ${tokenRef.current}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(reqId);
    };
  }, []);

  useEffect(() => {
    async function restore() {
      try {
        const refreshRes = await refreshStaff();

        tokenRef.current = refreshRes.accessToken;

        const profile = await api.get('/staff/public/auth/me');

        setAuth({
          accessToken: refreshRes.accessToken,
          staff: profile.data,
          isRestoring: false,
        });
      } catch {
        setAuth({
          accessToken: null,
          staff: null,
          isRestoring: false,
        });
      }
    }

    restore();
  }, []);

  function loginSuccess(data: any) {
    setAuth({
      accessToken: data.accessToken,
      staff: data.staff,
      isRestoring: false,
    });
  }

  return (
    <StaffAuthContext.Provider value={{ auth, loginSuccess }}>
      {children}
    </StaffAuthContext.Provider>
  );
}

export function useStaffAuth() {
  return useContext(StaffAuthContext);
}
