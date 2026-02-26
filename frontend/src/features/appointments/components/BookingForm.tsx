'use client';

import { useState } from 'react';
import { useDepartments } from '@/src/features/admin/hooks/useDepartments';
import { useDoctors } from '../hooks/useDoctors';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { useBookAppointment } from '../hooks/useBookAppointment';
import SlotSelector from './SlotSelector';

export default function BookingForm() {
  const [departmentId, setDepartmentId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [date, setDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { data: departments } = useDepartments();
  const { data: doctors } = useDoctors(departmentId);
  const { data: slots = [], isLoading } =
    useAvailableSlots(doctorId, date);

  const mutation = useBookAppointment();

  function handleBook() {
    if (!selectedSlot || !doctorId || !date) return;

    mutation.mutate({
      doctorId,
      appointmentDate: date,
      appointmentTime: selectedSlot,
      durationMinutes: 15,
    });
  }

  return (
    <div className="space-y-6 max-w-xl bg-white p-6 rounded-xl shadow-md">

      <h2 className="text-xl font-semibold">
        Book Appointment
      </h2>

      {/* Department */}
      <div>
        <label className="block mb-1 font-medium">
          Department
        </label>

        <select
          className="border p-2 w-full rounded-lg"
          value={departmentId}
          onChange={(e) => {
            setDepartmentId(e.target.value);
            setDoctorId('');
            setSelectedSlot(null);
          }}
        >
          <option value="">Select Department</option>

          {departments?.map(dep => (
            <option key={dep.id} value={dep.id}>
              {dep.name}
            </option>
          ))}
        </select>
      </div>

      {/* Doctor */}
      <div>
        <label className="block mb-1 font-medium">
          Doctor
        </label>

        <select
          className="border p-2 w-full rounded-lg"
          value={doctorId}
          onChange={(e) => {
            setDoctorId(e.target.value);
            setSelectedSlot(null);
          }}
          disabled={!departmentId}
        >
          <option value="">Select Doctor</option>

          {doctors?.map(doc => (
            <option key={doc.id} value={doc.id}>
              {doc.name} — {doc.job_title}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block mb-1 font-medium">
          Date
        </label>

        <input
          type="date"
          className="border p-2 w-full rounded-lg"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            setSelectedSlot(null);
          }}
          disabled={!doctorId}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Slots */}
      {isLoading && <p>Loading available slots...</p>}

      {slots.length > 0 && (
        <SlotSelector
          slots={slots}
          selected={selectedSlot}
          onSelect={setSelectedSlot}
        />
      )}

      {/* Button */}
      <button
        onClick={handleBook}
        disabled={!selectedSlot || mutation.isPending}
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg w-full transition"
      >
        {mutation.isPending ? 'Booking...' : 'Book Appointment'}
      </button>

      {/* Errors */}
      {mutation.isError && (
        <p className="text-red-500 text-sm">
          {(mutation.error as any)?.response?.data?.error}
        </p>
      )}

      {/* Success */}
      {mutation.isSuccess && (
        <p className="text-green-600 text-sm">
          Appointment booked successfully!
        </p>
      )}
    </div>
  );
}