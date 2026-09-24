'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import MyQueueCard from '@/src/features/appointments/components/MyQueueCard';
import AppointmentCard from '@/src/features/appointments/components/AppointmentCard';

import { getAppointmentHistory } from '@/src/features/appointments/api/getHistory';
import { getPatientDocuments } from '@/src/features/patient/api/getDocument';
import { getProfile } from '@/src/features/patient/api/getProfile';

import {
  Calendar,
  FileText,
  CalendarPlus,
  Upload,
  ArrowUpRight,
  ArrowRight,
  User,
  ExternalLink,
  CalendarDays,
  FileCheck,
  Clock,
  Sparkles,
  FileSpreadsheet,
  Image as ImageIcon
} from 'lucide-react';
import AdmissionStatus from '@/src/features/patient/components/AdmissionStatus';
import { getWallClockNow } from '@/src/lib/dateUtils';

function getDocIcon(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') {
    return (
      <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
        <FileText size={18} />
      </div>
    );
  }
  if (['jpg', 'jpeg', 'png', 'webp', 'svg'].includes(ext || '')) {
    return (
      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
        <ImageIcon size={18} />
      </div>
    );
  }
  return (
    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 border border-slate-200">
      <FileSpreadsheet size={18} />
    </div>
  );
}

export default function DashboardHome() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  const [profile, setProfile] = useState<any>(null);
  const [patientName, setPatientName] = useState('');

  const [totalAppointments, setTotalAppointments] = useState(0);
  const [upcomingAppointments, setUpcomingAppointments] = useState(0);
  const [totalDocuments, setTotalDocuments] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const appts = await getAppointmentHistory();
        const docs = await getPatientDocuments();
        const profileData = await getProfile();

        setProfile(profileData);
        setPatientName(profileData?.name || '');

        const upcoming = appts.filter((a: any) =>
          new Date(a.appointment_time) > getWallClockNow() &&
          a.status === 'SCHEDULED'
        );

        setAppointments(upcoming.slice(0, 3));
        setTotalAppointments(appts.length);
        setUpcomingAppointments(upcoming.length);

        setDocuments(docs || []);
        setTotalDocuments(docs?.length || 0);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      }
    }

    loadData();
  }, []);

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  }).format(new Date());

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Executive Welcome Banner */}
      <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent blur-2xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              {profile?.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt={patientName || 'Profile'}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-blue-500/20"
                />
              ) : (
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-extrabold text-2xl shadow-md ring-2 ring-blue-500/20">
                  {patientName?.charAt(0)?.toUpperCase() || 'P'}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
              </div>
            </div>

            {/* Title & Info */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back{patientName ? `, ${patientName}` : ''}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                  <Sparkles size={11} className="text-blue-500" />
                  Patient Portal
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500">
                Track your consultation queue, upcoming visits, and medical health records.
              </p>

              <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
                <CalendarDays size={13} className="text-slate-400" />
                <span>{todayFormatted}</span>
              </div>
            </div>
          </div>

          {/* Action Link */}
          <div className="flex items-center sm:self-center shrink-0">
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition"
            >
              <User size={15} className="text-slate-500" />
              <span>View Profile</span>
              <ArrowRight size={14} className="text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Admission Status */}
      <AdmissionStatus />

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Quick Actions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/book"
            className="group relative flex items-center justify-between p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-blue-400 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25">
                <CalendarPlus size={22} />
              </div>

              <div>
                <p className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
                  Book Appointment
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Schedule a doctor visit with department specialists
                </p>
              </div>
            </div>

            <div className="h-9 w-9 rounded-xl bg-slate-50 group-hover:bg-blue-50 text-slate-400 group-hover:text-blue-600 flex items-center justify-center transition shrink-0 ml-3">
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>

          <Link
            href="/dashboard/documents"
            className="group relative flex items-center justify-between p-5 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-emerald-400 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm shadow-emerald-500/25">
                <Upload size={22} />
              </div>

              <div>
                <p className="font-bold text-slate-900 text-base group-hover:text-emerald-600 transition">
                  Upload Documents
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Store medical test results, prescriptions, and scans
                </p>
              </div>
            </div>

            <div className="h-9 w-9 rounded-xl bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 flex items-center justify-center transition shrink-0 ml-3">
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Appointments */}
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Calendar size={22} />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">History</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalAppointments}
            </p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              Total Appointments
            </p>
          </div>
        </div>

        {/* Upcoming Visits */}
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
              <Clock size={22} />
            </div>
            {upcomingAppointments > 0 ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                Active
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Upcoming</span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {upcomingAppointments}
            </p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              Upcoming Visits
            </p>
          </div>
        </div>

        {/* Documents */}
        <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <FileCheck size={22} />
            </div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Records</span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalDocuments}
            </p>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
              Documents Uploaded
            </p>
          </div>
        </div>
      </div>

      {/* Live Queue Status / Today's Consultation */}
      <MyQueueCard />

      {/* Upcoming Appointments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Upcoming Appointments
            </h2>
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {appointments.length}
            </span>
          </div>

          <Link
            href="/dashboard/appointments"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mx-auto">
              <CalendarDays size={24} />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">No upcoming appointments scheduled</p>
              <p className="text-xs text-slate-500 mt-0.5">Need to consult with a doctor? Book an outpatient slot anytime.</p>
            </div>
            <Link
              href="/dashboard/book"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition mt-2"
            >
              <CalendarPlus size={14} />
              Book Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <AppointmentCard
                key={appt.id}
                appointment={appt}
              />
            ))}
          </div>
        )}
      </div>

      {/* Documents */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              Recent Documents
            </h2>
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {documents.length}
            </span>
          </div>

          <Link
            href="/dashboard/documents"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-2xl p-8 text-center space-y-3 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText size={24} />
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">No medical records uploaded yet</p>
              <p className="text-xs text-slate-500 mt-0.5">Upload lab results, test scans, or existing doctor prescriptions.</p>
            </div>
            <Link
              href="/dashboard/documents"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition mt-2"
            >
              <Upload size={14} />
              Upload Medical Report
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-slate-200/80 rounded-2xl divide-y divide-slate-100 shadow-sm overflow-hidden">
            {documents.slice(0, 3).map((doc: any) => (
              <a
                key={doc.file_key || doc.file_url}
                href={doc.file_url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between p-4 hover:bg-slate-50/80 transition"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {getDocIcon(doc.file_name)}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 transition truncate">
                      {doc.file_name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Medical file attachment • Click to view
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 group-hover:text-blue-600 bg-slate-50 group-hover:bg-blue-50 border border-slate-100 group-hover:border-blue-100 transition shrink-0 ml-3">
                  <span>View</span>
                  <ExternalLink size={13} />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}