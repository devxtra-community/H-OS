'use client';

import { useState } from 'react';
import { adminLogin } from '../../../features/admin/api/admin.api';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../../../features/admin/admin.auth.provider';

export default function AdminLoginPage() {
  const router = useRouter();
  const { loginSuccess } = useAdminAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    try {
      const res = await adminLogin(email, password);

      loginSuccess({
  accessToken: res.accessToken,
  admin: res.admin,
});

      router.push('/admin/dashboard');
    } catch {
      alert('Invalid credentials');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow w-96 space-y-4">
        <h1 className="text-xl font-bold">Admin Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="bg-black text-white w-full py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}