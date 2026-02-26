'use client';

import { AuthProvider } from '@/src/auth/auth.provider';

export default function PatientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}