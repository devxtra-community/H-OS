'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePharmacyHistory, useBedHistory } from '@/src/features/admin/hooks/useAudits';
import {
  History,
  Pill,
  Bed,
  Search,
  RefreshCw,
  ArrowLeft,
  User,
  Stethoscope,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  PackageCheck,
  Activity,
} from 'lucide-react';

export default function HistoryAndAuditsPage() {
  const [activeTab, setActiveTab] = useState<'pharmacy' | 'beds'>('pharmacy');
  const [pharmacySearch, setPharmacySearch] = useState('');
  const [bedSearch, setBedSearch] = useState('');

  const {
    data: pharmacyRecords,
    isLoading: pharmacyLoading,
    isError: pharmacyError,
    refetch: refetchPharmacy,
  } = usePharmacyHistory();

  const {
    data: bedRecords,
    isLoading: bedLoading,
    isError: bedError,
    refetch: refetchBeds,
  } = useBedHistory();

  const pharmacyHistory = pharmacyRecords || [];
  const bedHistory = bedRecords || [];

  // Pharmacy calculations
  const totalPrescriptions = pharmacyHistory.length;
  const totalUnitsDispensed = pharmacyHistory.reduce((acc, curr) => {
    const itemsTotal = (curr.items || []).reduce((sum, item) => sum + (item.quantity || 0), 0);
    return acc + itemsTotal;
  }, 0);
  const uniquePharmacyPatients = new Set(pharmacyHistory.map((p) => p.patient_id)).size;

  const filteredPharmacy = pharmacyHistory.filter((item) => {
    const query = pharmacySearch.toLowerCase().trim();
    if (!query) return true;
    const matchesPatient = item.patient_name?.toLowerCase().includes(query);
    const matchesDoctor = item.doctor_name?.toLowerCase().includes(query);
    const matchesItems = item.items?.some((i) => i.item_name?.toLowerCase().includes(query));
    return matchesPatient || matchesDoctor || matchesItems;
  });

  // Bed calculations
  const totalBedAssignments = bedHistory.length;
  const activeBedStays = bedHistory.filter((b) => !b.discharged_at).length;
  const completedDischarges = bedHistory.filter((b) => !!b.discharged_at).length;

  const filteredBeds = bedHistory.filter((item) => {
    const query = bedSearch.toLowerCase().trim();
    if (!query) return true;
    const matchesBed = item.bed_number?.toLowerCase().includes(query);
    const matchesWard = item.ward_name?.toLowerCase().includes(query);
    const matchesRoom = item.room_number?.toLowerCase().includes(query);
    const matchesPatient = item.patient_name?.toLowerCase().includes(query);
    const matchesDoctor = item.doctor_name?.toLowerCase().includes(query);
    return matchesBed || matchesWard || matchesRoom || matchesPatient || matchesDoctor;
  });

  const formatTimestamp = (dateStr?: string | null) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const calculateDuration = (startStr: string, endStr?: string | null) => {
    try {
      const start = new Date(startStr).getTime();
      const end = endStr ? new Date(endStr).getTime() : Date.now();
      const diffMs = end - start;
      if (diffMs < 0) return 'Just started';
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      if (days > 0) return `${days}d ${hours % 24}h`;
      if (hours > 0) return `${hours} hrs`;
      const mins = Math.floor(diffMs / (1000 * 60));
      return `${mins} mins`;
    } catch {
      return '—';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Breadcrumb & Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard"
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-200 transition shadow-2xs cursor-pointer"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">History &amp; Audits</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Institutional Audits
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">
              Audit trails of medication dispensation and inpatient bed assignments.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 bg-gray-100/80 p-1 rounded-2xl border border-gray-200/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('pharmacy')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'pharmacy'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Pill size={14} />
            <span>Pharmacy History ({pharmacyHistory.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('beds')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'beds'
                ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bed size={14} />
            <span>Bed History ({bedHistory.length})</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'pharmacy' ? (
        <div className="space-y-6">
          {/* Pharmacy KPI Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
                <PackageCheck size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prescriptions Dispensed
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {pharmacyLoading ? '—' : totalPrescriptions}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
                <Pill size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Units Dispensed
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {pharmacyLoading ? '—' : totalUnitsDispensed}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 shrink-0">
                <User size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patients Served
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  {pharmacyLoading ? '—' : uniquePharmacyPatients}
                </p>
              </div>
            </div>
          </div>

          {/* Pharmacy Audits Table Card */}
          <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span>Pharmacy Medication Dispensation Audit</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                    {filteredPharmacy.length} events
                  </span>
                </h2>
                <p className="text-xs text-gray-500">
                  Logs tracking when each medicine was dispensed, to which patient, and prescribed by which doctor.
                </p>
              </div>

              <button
                type="button"
                onClick={() => refetchPharmacy()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:text-indigo-600 hover:bg-gray-50 text-xs font-semibold transition cursor-pointer self-start md:self-auto"
              >
                <RefreshCw size={14} className={pharmacyLoading ? 'animate-spin' : ''} />
                <span>Refresh Audit Logs</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by medicine, patient, or doctor..."
                value={pharmacySearch}
                onChange={(e) => setPharmacySearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition placeholder:text-gray-400"
              />
            </div>

            {/* Table */}
            {pharmacyLoading ? (
              <div className="py-16 text-center">
                <div className="h-10 w-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-gray-500">Loading pharmacy history records...</p>
              </div>
            ) : pharmacyError ? (
              <div className="py-12 text-center text-rose-600 text-sm">
                Failed to load pharmacy logs. Please verify connection and retry.
              </div>
            ) : filteredPharmacy.length === 0 ? (
              <div className="py-16 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <Pill size={36} className="mx-auto text-gray-400 mb-2 stroke-1" />
                <p className="text-sm font-semibold text-gray-800">No pharmacy dispensation records</p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  {pharmacySearch
                    ? 'No records match your search filter.'
                    : 'No prescriptions have been marked as dispensed yet.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Dispensing Time</th>
                      <th className="py-3.5 px-4">Medicines &amp; Quantities</th>
                      <th className="py-3.5 px-4">Patient (Recipient)</th>
                      <th className="py-3.5 px-4">Prescribed By (Doctor)</th>
                      <th className="py-3.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPharmacy.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50/70 transition">
                        {/* Dispensing Time */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-gray-900 flex items-center gap-1.5">
                              <Clock size={13} className="text-indigo-600" />
                              <span>{formatTimestamp(record.dispensed_at || record.created_at)}</span>
                            </p>
                            <p className="text-[11px] text-gray-400 pl-5">Prescription ID: {record.id.slice(0, 8)}</p>
                          </div>
                        </td>

                        {/* Medicine Items & Quantities */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1.5 max-w-sm">
                            {(record.items || []).map((item, idx) => (
                              <div
                                key={item.id || idx}
                                className="flex items-center gap-2 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200/60"
                              >
                                <Pill size={12} className="text-emerald-600 shrink-0" />
                                <span className="font-semibold text-gray-900 truncate">
                                  {item.item_name || 'Medicine Item'}
                                </span>
                                <span className="ml-auto px-2 py-0.5 rounded-md bg-white border border-gray-200 text-[11px] font-bold text-indigo-700 shrink-0">
                                  &times;{item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Patient */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 border border-purple-100">
                              <User size={14} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {record.patient_name || 'Patient'}
                              </p>
                              <p className="text-[11px] text-gray-400 font-mono truncate">
                                ID: {record.patient_id.slice(0, 8)}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Prescribing Doctor */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                              <Stethoscope size={14} />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {record.doctor_name || 'Attending Doctor'}
                              </p>
                              {record.doctor_email && (
                                <p className="text-[11px] text-gray-400 truncate">{record.doctor_email}</p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <CheckCircle2 size={12} className="text-emerald-600" />
                            <span>Dispensed</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Bed KPI Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
                <Bed size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Bed Allocations
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {bedLoading ? '—' : totalBedAssignments}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-amber-50 text-amber-600 shrink-0">
                <Activity size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Active Inpatient Stays
                </p>
                <p className="text-2xl font-bold text-amber-600">
                  {bedLoading ? '—' : activeBedStays}
                </p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600 shrink-0">
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Completed Discharges
                </p>
                <p className="text-2xl font-bold text-emerald-600">
                  {bedLoading ? '—' : completedDischarges}
                </p>
              </div>
            </div>
          </div>

          {/* Bed Audits Table Card */}
          <section className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span>Bed Assignment &amp; Inpatient Stay History</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                    {filteredBeds.length} assignments
                  </span>
                </h2>
                <p className="text-xs text-gray-500">
                  Audit logs detailing which bed was allocated to which patient, ordered by which doctor, with admission and discharge timestamps.
                </p>
              </div>

              <button
                type="button"
                onClick={() => refetchBeds()}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-gray-50 text-xs font-semibold transition cursor-pointer self-start md:self-auto"
              >
                <RefreshCw size={14} className={bedLoading ? 'animate-spin' : ''} />
                <span>Refresh Bed Logs</span>
              </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                placeholder="Search by bed, room, ward, patient, or doctor..."
                value={bedSearch}
                onChange={(e) => setBedSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition placeholder:text-gray-400"
              />
            </div>

            {/* Table */}
            {bedLoading ? (
              <div className="py-16 text-center">
                <div className="h-10 w-10 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-gray-500">Loading bed allocation logs...</p>
              </div>
            ) : bedError ? (
              <div className="py-12 text-center text-rose-600 text-sm">
                Failed to load bed history. Please verify connection and retry.
              </div>
            ) : filteredBeds.length === 0 ? (
              <div className="py-16 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <Bed size={36} className="mx-auto text-gray-400 mb-2 stroke-1" />
                <p className="text-sm font-semibold text-gray-800">No bed allocation records</p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                  {bedSearch
                    ? 'No bed assignment events match your search query.'
                    : 'No patient bed assignments have been logged in the system yet.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-gray-500 text-xs font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Bed &amp; Ward</th>
                      <th className="py-3.5 px-4">Patient (Assigned To)</th>
                      <th className="py-3.5 px-4">Ordering Doctor</th>
                      <th className="py-3.5 px-4">Assigned At</th>
                      <th className="py-3.5 px-4">Discharged At</th>
                      <th className="py-3.5 px-4 text-right">Stay Duration / Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBeds.map((assignment) => {
                      const isDischarged = !!assignment.discharged_at;
                      return (
                        <tr key={assignment.id} className="hover:bg-gray-50/70 transition">
                          {/* Bed & Ward */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                                  isDischarged
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                <Bed size={15} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{assignment.bed_number}</p>
                                <p className="text-[11px] text-gray-500 flex items-center gap-1">
                                  <Building2 size={11} className="text-gray-400" />
                                  <span>{assignment.ward_name}</span> &bull;{' '}
                                  <span>Room {assignment.room_number}</span>
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Patient */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 border border-purple-100">
                                <User size={14} />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-gray-900 truncate">
                                  {assignment.patient_name || 'Patient'}
                                </p>
                                <p className="text-[11px] text-gray-400 font-mono truncate">
                                  ID: {assignment.patient_id.slice(0, 8)}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Ordering Doctor */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-100">
                                <Stethoscope size={14} />
                              </div>
                              <p className="font-semibold text-gray-900 truncate">
                                {assignment.doctor_name || 'Attending Physician'}
                              </p>
                            </div>
                          </td>

                          {/* Assigned Timestamp */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-xs text-gray-700">
                            <div className="flex items-center gap-1.5">
                              <Clock size={12} className="text-gray-400" />
                              <span>{formatTimestamp(assignment.assigned_at)}</span>
                            </div>
                          </td>

                          {/* Discharged Timestamp */}
                          <td className="py-3.5 px-4 whitespace-nowrap text-xs text-gray-700">
                            {isDischarged ? (
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                <span>{formatTimestamp(assignment.discharged_at)}</span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                Active Stay
                              </span>
                            )}
                          </td>

                          {/* Stay Duration / Status */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="space-y-0.5">
                              <p className="font-semibold text-gray-900 text-xs">
                                {calculateDuration(assignment.assigned_at, assignment.discharged_at)}
                              </p>
                              <p className="text-[10px] text-gray-400 font-medium">
                                {isDischarged ? 'Discharged' : 'Stay in progress'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
