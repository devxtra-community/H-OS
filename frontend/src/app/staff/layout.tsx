'use client';

import { StaffAuthProvider } from '../../staff/auth/staff.auth.provider';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StaffAuthProvider>{children}</StaffAuthProvider>;
}
