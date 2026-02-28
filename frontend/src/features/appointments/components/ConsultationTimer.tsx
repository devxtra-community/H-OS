'use client';

import { useEffect, useState } from 'react';

interface Props {
  startTime: string;
  durationMinutes: number;
}

export default function ConsultationTimer({
  startTime,
  durationMinutes,
}: Props) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const start = new Date(startTime).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((now - start) / 1000));
      setElapsedSeconds(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const plannedSeconds = durationMinutes * 60;

  const overtimeSeconds =
    elapsedSeconds > plannedSeconds
      ? elapsedSeconds - plannedSeconds
      : 0;

  const formatTime = (total: number) => {
    const mins = Math.floor(total / 60)
      .toString()
      .padStart(2, '0');
    const secs = (total % 60)
      .toString()
      .padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="mt-3 p-3 rounded-lg border bg-gray-50 space-y-1">
      <p className="font-semibold">
        ⏱ {formatTime(elapsedSeconds)} elapsed
      </p>

      <p className="text-sm text-gray-600">
        Planned: {durationMinutes} min
      </p>

      {overtimeSeconds > 0 && (
        <p className="text-red-600 font-medium">
          ⚠ Running {Math.floor(overtimeSeconds / 60)} min late
        </p>
      )}
    </div>
  );
}