'use client';

import { useState } from 'react';
import { useCreateBed } from '../hooks/useCreateBed';
import { useQuery } from '@tanstack/react-query';
import { getWards, getRooms } from '../api/beds.api';
import { Building2, DoorOpen, Bed, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CreateBedForm() {
  const [wardId, setWardId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [bedNumber, setBedNumber] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const mutation = useCreateBed();

  const { data: wards, isLoading: wardsLoading } = useQuery({
    queryKey: ['wards'],
    queryFn: getWards,
  });

  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['rooms', wardId],
    queryFn: () => getRooms(wardId),
    enabled: !!wardId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !bedNumber.trim()) return;
    setStatusMessage(null);

    try {
      await mutation.mutateAsync({
        roomId,
        bedNumber: bedNumber.trim(),
      });

      setStatusMessage({ type: 'success', text: `Bed ${bedNumber.trim()} provisioned successfully!` });
      setBedNumber('');
      setRoomId('');
      setWardId('');
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to create bed. Please ensure this bed number is unique within the room.' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Ward Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Building2 size={14} className="text-blue-600" />
            1. Select Ward
          </label>
          <select
            value={wardId}
            onChange={(e) => {
              setWardId(e.target.value);
              setRoomId('');
              setStatusMessage(null);
            }}
            required
            disabled={wardsLoading}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer disabled:opacity-50"
          >
            <option value="">Select Ward</option>
            {wards?.map((ward: any) => (
              <option key={ward.id} value={ward.id}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>

        {/* Room Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
            <DoorOpen size={14} className="text-blue-600" />
            2. Select Room
          </label>
          <select
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
              setStatusMessage(null);
            }}
            required
            disabled={!wardId || roomsLoading}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all cursor-pointer disabled:opacity-50"
          >
            <option value="">
              {!wardId ? 'Select ward first' : roomsLoading ? 'Loading rooms...' : 'Select Room'}
            </option>
            {rooms?.map((room: any) => (
              <option key={room.id} value={room.id}>
                Room {room.room_number}
              </option>
            ))}
          </select>
        </div>

        {/* Bed Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Bed size={14} className="text-blue-600" />
            3. Bed Identifier
          </label>
          <input
            value={bedNumber}
            onChange={(e) => {
              setBedNumber(e.target.value);
              setStatusMessage(null);
            }}
            placeholder="e.g. Bed-01, ICU-B"
            required
            disabled={!roomId}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-gray-400 disabled:opacity-50"
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
          disabled={mutation.isPending || !roomId || !bedNumber.trim()}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium text-sm transition-all shadow-sm shadow-blue-200 hover:shadow-md hover:shadow-blue-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {mutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Configuring Bed...</span>
            </>
          ) : (
            <>
              <PlusCircle size={16} />
              <span>Setup Bed</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}