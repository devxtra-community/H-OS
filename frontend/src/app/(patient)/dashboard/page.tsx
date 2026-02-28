'use client';

import MyQueueCard from '@/src/features/appointments/components/MyQueueCard';

export default function DashboardHome() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-2xl font-bold mb-2">
          Welcome to your Dashboard
        </h1>

        <p className="text-gray-600">
          Track your appointment and queue status in real time.
        </p>
      </div>

      {/* 🔥 Live Queue Card */}
      <MyQueueCard />

    </div>
  );
}