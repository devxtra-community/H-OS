'use client';

import { useState } from 'react';
import { useCreateRoom } from '../hooks/useCreateRoom';
import { useQuery } from '@tanstack/react-query';
import { getWards } from '../api/beds.api';
import { Building2, DoorOpen, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CreateRoomForm() {
  const [wardId, setWardId] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const mutation = useCreateRoom();

  const { data: wards, isLoading: wardsLoading } = useQuery({
    queryKey: ['wards'],
    queryFn: getWards,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wardId || !roomNumber.trim()) return;
    setStatusMessage(null);

    try {
      await mutation.mutateAsync({
        wardId,
        roomNumber: roomNumber.trim(),
      });

      setStatusMessage({ type: 'success', text: `Room ${roomNumber.trim()} created successfully!` });
      setRoomNumber('');
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to create room. Please verify that this room number does not already exist.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ward Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Building2 size={14} className="text-purple-600" />
            Target Ward
          </label>
          <select
            value={wardId}
            onChange={(e) => {
              setWardId(e.target.value);
              setStatusMessage(null);
            }}
            required
            disabled={wardsLoading}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all cursor-pointer disabled:opacity-50"
          >
            <option value="">Select Hospital Ward</option>
            {wards?.map((ward: any) => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>

        {/* Room Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
            <DoorOpen size={14} className="text-purple-600" />
            Room Identifier
          </label>
          <input
            value={roomNumber}
            onChange={(e) => {
              setRoomNumber(e.target.value);
              setStatusMessage(null);
            }}
            placeholder="e.g. 101, 204-B, ICU-3"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 transition-all placeholder:text-gray-400"
          />
        </div>
      </div>

      {statusMessage?.type === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      {statusMessage?.type === 'error' && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm animate-in fade-in duration-200">
          <AlertCircle size={18} className="text-red-600 shrink-0" />
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={mutation.isPending || !wardId || !roomNumber.trim()}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium text-sm transition-all shadow-sm shadow-purple-200 hover:shadow-md hover:shadow-purple-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {mutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Creating Room...</span>
            </>
          ) : (
            <>
              <PlusCircle size={16} />
              <span>Create Room</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}