'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import MyQueueCard from '@/src/features/appointments/components/MyQueueCard';
import AppointmentCard from '@/src/features/appointments/components/AppointmentCard';

import { getAppointmentHistory } from '@/src/features/appointments/api/getHistory';
import { getPatientDocuments } from '@/src/features/patient/api/getDocument';
import { getProfile } from '@/src/features/patient/api/getProfile';

import { Calendar, FileText, CalendarPlus, Upload, CloudCog } from 'lucide-react';
import AdmissionStatus from '@/src/features/patient/components/AdmissionStatus';

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

      const appts = await getAppointmentHistory();
      const docs = await getPatientDocuments();
      const profileData = await getProfile();

      console.log('profiledata', profileData);

      setProfile(profileData);
      setPatientName(profileData.name);

      const upcoming = appts.filter((a: any) =>
        new Date(a.appointment_time) > new Date() &&
        a.status === 'SCHEDULED'
      );

      setAppointments(upcoming.slice(0, 3));

      setTotalAppointments(appts.length);
      setUpcomingAppointments(upcoming.length);

      setDocuments(docs);
      setTotalDocuments(docs.length);
    }

    loadData();

  }, []);

  return (
    <div className="space-y-10">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          {/* Profile Image */}

          {profile?.profile_image ? (

            <img
              src={profile.profile_image}
              alt="Profile"
              className="w-18 h-18 rounded-full object-cover border"
            />

          ) : (

            <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold">
              {patientName?.charAt(0)}
            </div>

          )}

          <div>

            <h1 className="text-2xl font-bold">
              Welcome back{patientName ? `, ${patientName}` : ''}
            </h1>

            <p className="text-gray-600">
              Track your appointment and queue status in real time.
            </p>

          </div>

        </div>

        <Link
          href="/dashboard/profile"
          className="text-sm text-blue-600 hover:underline"
        >
          View Profile
        </Link>

      </div>

      {/* Admission Status */}
      <AdmissionStatus />

      {/* Quick Actions */}

      <div>

        <h2 className="text-lg font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          <Link
            href="/dashboard/book"
            className="flex items-center gap-4 p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition"
          >

            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <CalendarPlus size={22} />
            </div>

            <div>
              <p className="font-semibold">
                Book Appointment
              </p>

              <p className="text-sm text-slate-500">
                Schedule a doctor visit
              </p>
            </div>

          </Link>

          <Link
            href="/dashboard/documents"
            className="flex items-center gap-4 p-6 bg-white border rounded-2xl shadow-sm hover:shadow-md transition"
          >

            <div className="p-3 rounded-xl bg-green-100 text-green-600">
              <Upload size={22} />
            </div>

            <div>
              <p className="font-semibold">
                Upload Documents
              </p>

              <p className="text-sm text-slate-500">
                Upload medical reports
              </p>
            </div>

          </Link>

        </div>

      </div>

      {/* Stats Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">

          <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
            <Calendar size={22} />
          </div>

          <div>

            <p className="text-sm text-slate-500">
              Total Appointments
            </p>

            <p className="text-2xl font-bold">
              {totalAppointments}
            </p>

          </div>

        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">

          <div className="p-3 rounded-xl bg-green-100 text-green-600">
            <Calendar size={22} />
          </div>

          <div>

            <p className="text-sm text-slate-500">
              Upcoming Visits
            </p>

            <p className="text-2xl font-bold">
              {upcomingAppointments}
            </p>

          </div>

        </div>

        <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4">

          <div className="p-3 rounded-xl bg-purple-100 text-purple-600">
            <FileText size={22} />
          </div>

          <div>

            <p className="text-sm text-slate-500">
              Documents Uploaded
            </p>

            <p className="text-2xl font-bold">
              {totalDocuments}
            </p>

          </div>

        </div>

      </div>

      {/* Queue */}

      <MyQueueCard />

      {/* Upcoming Appointments */}

      <div>

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-lg font-semibold">
            Upcoming Appointments
          </h2>

          <Link
            href="/dashboard/appointments"
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </Link>

        </div>

        {appointments.length === 0 ? (

          <div className="bg-white border rounded-2xl p-6 text-slate-500">
            No upcoming appointments
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

      <div>

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-lg font-semibold">
            Documents
          </h2>

          <Link
            href="/dashboard/documents"
            className="text-sm text-blue-600 hover:underline"
          >
            View All
          </Link>

        </div>

        {documents.length === 0 ? (

          <div className="bg-white border rounded-2xl p-6 text-slate-500">
            No documents uploaded yet
          </div>

        ) : (

          <div className="bg-white border rounded-2xl divide-y">

            {documents.slice(0, 3).map((doc: any) => (

              <a
                key={doc.file_key}
                href={doc.file_url}
                target="_blank"
                className="flex items-center gap-3 p-4 hover:bg-slate-50 transition"
              >

                <FileText size={18} className="text-blue-600" />

                <span className="text-sm font-medium text-slate-800">
                  {doc.file_name}
                </span>

              </a>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}