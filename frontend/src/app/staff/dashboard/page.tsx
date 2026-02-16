'use client';

import { useStaffAuth } from '../../../staff/auth/staff.auth.provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StaffDashboardPage() {
  const { auth } = useStaffAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isRestoring && !auth.accessToken) {
      router.replace('/staff/login');
    }
  }, [auth.accessToken, auth.isRestoring, router]);

if (auth.isRestoring) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
    </div>
  );
}

  if (!auth.accessToken) return null;

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6">
        Staff Dashboard
      </h1>

      <div className="bg-white shadow rounded p-6 space-y-2">
        <p><strong>Name:</strong> {auth.staff?.name}</p>
        <p><strong>Email:</strong> {auth.staff?.email}</p>
        <p><strong>Department:</strong> {auth.staff?.department}</p>
        <p><strong>Role:</strong> {auth.staff?.role}</p>
        <p><strong>Job Title:</strong> {auth.staff?.job_title}</p>
      </div>
    </div>
  );
}
