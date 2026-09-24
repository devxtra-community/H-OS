'use client';

import { useState } from 'react';
import { useDepartments } from '@/src/features/admin/hooks/useDepartments';
import { useDoctors } from '../hooks/useDoctors';
import { useAvailableSlots } from '../hooks/useAvailableSlots';
import { useBookAppointment } from '../hooks/useBookAppointment';

import DoctorCard from './DoctorCard';
import SlotSelector from './SlotSelector';
import BookingStepper from './BookingStepper';
import BookingSuccess from './BookingSuccess';

import {
  Calendar,
  Building2,
  Stethoscope,
  Clock,
  ArrowRight,
  AlertCircle,
  CalendarCheck,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { formatAppointmentDate, formatAppointmentTime } from '@/src/lib/dateUtils';

export default function BookingForm() {
  const [date, setDate] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { data: departments, isLoading: deptsLoading } = useDepartments();
  const { data: doctors, isLoading: doctorsLoading } = useDoctors(departmentId);
  const { data: slots = [], isLoading: slotsLoading } = useAvailableSlots(doctorId, date);

  const mutation = useBookAppointment();

  // Step calculation
  let step = 1;
  if (date) step = 2;
  if (departmentId) step = 3;
  if (doctorId) step = 4;

  const todayStr = new Date().toISOString().split('T')[0];

  function getOffsetDate(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }

  const selectedDepartment = departments?.find((d) => d.id === departmentId);
  const selectedDoctor = doctors?.find((d) => d.id === doctorId);

  function handleBook() {
    if (!selectedSlot || !doctorId || !date) return;

    const fullDateTime = `${date}T${selectedSlot}:00`;

    mutation.mutate({
      doctorId,
      appointmentTime: fullDateTime,
      durationMinutes: 15,
    });
  }

  function handleReset() {
    setDate('');
    setDepartmentId('');
    setDoctorId('');
    setSelectedSlot(null);
    mutation.reset();
  }

  // If successfully booked, show modern receipt/success screen
  if (mutation.isSuccess) {
    const bookedTime = date && selectedSlot ? `${date}T${selectedSlot}:00` : '';
    return (
      <BookingSuccess
        doctorName={selectedDoctor?.name}
        departmentName={selectedDepartment?.name}
        appointmentTime={bookedTime}
        onBookAnother={handleReset}
      />
    );
  }

  return (
    <div className="w-full space-y-8">
      {/* STEP INDICATOR */}
      <BookingStepper step={step} />

      {/* ERROR BANNER */}
      {mutation.isError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-sm shadow-xs animate-in fade-in duration-200">
          <AlertCircle size={18} className="text-rose-600 shrink-0" />
          <span>
            Failed to book appointment. This slot may have just been reserved. Please select another slot.
          </span>
        </div>
      )}

      {/* MAIN TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* LEFT COLUMN: Date & Department Selection + Live Booking Summary */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Calendar size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Schedule Details
                  </h2>
                  <p className="text-xs text-slate-500">
                    Choose visit date &amp; department.
                  </p>
                </div>
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={13} className="text-indigo-600" />
                Select Date
              </label>

              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
                value={date}
                min={todayStr}
                onChange={(e) => {
                  setDate(e.target.value);
                  setDoctorId('');
                  setSelectedSlot(null);
                }}
              />

              {/* Quick Date Pills */}
              <div className="flex items-center gap-1.5 pt-1">
                {[
                  { label: 'Today', val: todayStr },
                  { label: 'Tomorrow', val: getOffsetDate(1) },
                  { label: '+2 Days', val: getOffsetDate(2) },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setDate(item.val);
                      setDoctorId('');
                      setSelectedSlot(null);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      date === item.val
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Department Dropdown */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 size={13} className="text-indigo-600" />
                Specialty Department
              </label>

              <select
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer disabled:opacity-50"
                value={departmentId}
                onChange={(e) => {
                  setDepartmentId(e.target.value);
                  setDoctorId('');
                  setSelectedSlot(null);
                }}
                disabled={!date || deptsLoading}
              >
                <option value="">
                  {!date ? 'Select date first' : deptsLoading ? 'Loading departments...' : 'Choose Specialty Department'}
                </option>
                {departments?.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* LIVE BOOKING SUMMARY PREVIEW CARD */}
          {(date || departmentId || doctorId) && (
            <div className="bg-slate-50/80 border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-2xs animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Sparkles size={14} className="text-indigo-600" />
                  Booking Summary
                </div>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                  Draft
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {date && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Date:</span>
                    <span className="font-semibold text-slate-800">
                      {formatAppointmentDate(`${date}T00:00:00Z`)}
                    </span>
                  </div>
                )}

                {selectedDepartment && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Department:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedDepartment.name}
                    </span>
                  </div>
                )}

                {selectedDoctor && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Doctor:</span>
                    <span className="font-semibold text-slate-800">
                      Dr. {selectedDoctor.name}
                    </span>
                  </div>
                )}

                {selectedSlot && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Time Slot:</span>
                    <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {formatAppointmentTime(`${date}T${selectedSlot}:00Z`)}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-slate-500">
                  <span>Duration:</span>
                  <span className="font-medium">15 min consultation</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Doctor Selection & Slot Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. DOCTOR SELECTION CARD */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Select Specialist
                  </h3>
                  <p className="text-xs text-slate-500">
                    Choose an attending physician from the department.
                  </p>
                </div>
              </div>

              {doctors && doctors.length > 0 && (
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  {doctors.length} {doctors.length === 1 ? 'Doctor' : 'Doctors'}
                </span>
              )}
            </div>

            {/* Doctors Content */}
            {!departmentId ? (
              <div className="p-8 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 text-center space-y-2">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <Building2 size={20} />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Select a Department First
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Choose your appointment date and department on the left to view available clinical staff.
                </p>
              </div>
            ) : doctorsLoading ? (
              <div className="p-8 text-center space-y-2">
                <div className="h-8 w-8 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
                <p className="text-xs font-medium text-slate-400">Loading department doctors...</p>
              </div>
            ) : !doctors || doctors.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 text-center space-y-2">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <UserCheck size={20} />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  No Doctors in this Department
                </p>
                <p className="text-xs text-slate-400">
                  No active doctors are currently assigned to this department. Please choose another specialty.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {doctors.map((doc) => (
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
            )}
          </div>

          {/* 2. TIME SLOT SELECTION CARD */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Clock size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Available Time Slots
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select a 15-minute consultation window.
                  </p>
                </div>
              </div>

              {doctorId && slots.length > 0 && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  {slots.length} Available
                </span>
              )}
            </div>

            {/* Slots Content */}
            {!doctorId ? (
              <div className="p-8 rounded-2xl bg-slate-50/70 border border-dashed border-slate-200 text-center space-y-2">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                  <Clock size={20} />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  No Doctor Selected
                </p>
                <p className="text-xs text-slate-400">
                  Please pick an available specialist above to load their real-time open slots.
                </p>
              </div>
            ) : slotsLoading ? (
              <div className="p-8 text-center space-y-2">
                <div className="h-8 w-8 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
                <p className="text-xs font-medium text-slate-400">Calculating available slot schedule...</p>
              </div>
            ) : (
              <SlotSelector
                slots={slots}
                selected={selectedSlot}
                onSelect={setSelectedSlot}
              />
            )}
          </div>

          {/* 3. CONFIRM APPOINTMENT SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleBook}
              disabled={!selectedSlot || mutation.isPending}
              className="w-full py-4 px-6 rounded-2xl hos-gradient-bg hover:opacity-95 text-white font-semibold text-sm transition-all duration-200 shadow-sm shadow-indigo-200 hover:shadow-md hover:shadow-indigo-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer active:scale-98"
            >
              {mutation.isPending ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scheduling Appointment...</span>
                </>
              ) : (
                <>
                  <CalendarCheck size={18} />
                  <span>
                    {selectedSlot
                      ? `Confirm Appointment with Dr. ${selectedDoctor?.name || 'Doctor'}`
                      : 'Select a Time Slot to Confirm'}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}