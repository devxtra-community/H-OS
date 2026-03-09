'use client';

import { useState } from 'react';
import { useDepartments } from '@/src/features/admin/hooks/useDepartments';
import { useDoctors } from '../hooks/useDoctors';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { useBookAppointment } from '../hooks/useBookAppointment';

import DoctorCard from './DoctorCard';
import SlotSelector from './SlotSelector';
import BookingStepper from './BookingStepper';

export default function BookingForm() {

  const [date, setDate] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { data: departments } = useDepartments();
  const { data: doctors } = useDoctors(departmentId);
  const { data: slots = [], isLoading } =
    useAvailableSlots(doctorId, date);

  const mutation = useBookAppointment();

  let step = 1;
  if (date) step = 2;
  if (departmentId) step = 3;
  if (doctorId) step = 4;

  function handleBook() {

    if (!selectedSlot || !doctorId || !date) return;

    const fullDateTime = `${date}T${selectedSlot}:00`;

    mutation.mutate({
      doctorId,
      appointmentTime: fullDateTime,
      durationMinutes: 15,
    });

  }

  return (

    <div className="w-full">

      {/* STEP INDICATOR */}

      <BookingStepper step={step} />

      {/* MAIN LAYOUT */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* LEFT PANEL */}

        <div className="bg-slate-50 border rounded-2xl p-6 space-y-6">

          <h2 className="font-semibold text-lg">
            Appointment Details
          </h2>

          {/* Date */}

          <div>

            <label className="block mb-1 font-medium">
              Select Date
            </label>

            <input
              type="date"
              className="border p-3 w-full rounded-lg"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setDoctorId('');
                setSelectedSlot(null);
              }}
              min={new Date().toISOString().split('T')[0]}
            />

          </div>

          {/* Department */}

          <div>

            <label className="block mb-1 font-medium">
              Choose Department
            </label>

            <select
              className="border p-3 w-full rounded-lg"
              value={departmentId}
              onChange={(e) => {
                setDepartmentId(e.target.value);
                setDoctorId('');
                setSelectedSlot(null);
              }}
              disabled={!date}
            >

              <option value="">
                Select Department
              </option>

              {departments?.map(dep => (
                <option key={dep.id} value={dep.id}>
                  {dep.name}
                </option>
              ))}

            </select>

          </div>

        </div>

        {/* RIGHT PANEL */}

        <div className="lg:col-span-2 space-y-8">

          {/* DOCTOR SECTION */}

          <div className="bg-white border rounded-2xl p-6">

            <h3 className="font-semibold mb-4">
              Select Doctor
            </h3>

            <div className="grid md:grid-cols-2 gap-4">

              {doctors?.map((doc) => (

                <DoctorCard
                  key={doc.id}
                  doctor={doc}
                  selected={doctorId === doc.id}
                  onSelect={(id) => {
                    setDoctorId(id);
                    setSelectedSlot(null);
                  }}
                />

              ))}

            </div>

          </div>

          {/* SLOT SECTION */}

          <div className="bg-white border rounded-2xl p-6">

            <h3 className="font-semibold mb-4">
              Available Time Slots
            </h3>

            {isLoading && (
              <p className="text-sm text-gray-500">
                Loading slots...
              </p>
            )}

            {doctorId && (
              <SlotSelector
                slots={slots}
                selected={selectedSlot}
                onSelect={setSelectedSlot}
              />
            )}

          </div>

          {/* BOOK BUTTON */}

          <button
            onClick={handleBook}
            disabled={!selectedSlot || mutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl w-full transition font-semibold"
          >

            {mutation.isPending
              ? 'Booking Appointment...'
              : 'Confirm Appointment'}

          </button>

        </div>

      </div>

    </div>

  );

}