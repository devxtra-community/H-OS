'use client';

import { useState, useEffect } from 'react';
import { useCreateStaff } from '../hooks/useCreateStaff';
import { useDepartments } from '../hooks/useDepartments';
import type { CreateStaffInput } from '../api/createStaff.api';
import { User, Mail, Lock, Building2, Shield, Briefcase, CheckCircle2, AlertCircle, PlusCircle } from 'lucide-react';

const JOB_TITLES = [
  'Senior Consultant',
  'Junior Consultant',
  'Resident Doctor',
  'Head Nurse',
  'Staff Nurse',
];

export default function CreateStaffForm() {
  const mutation = useCreateStaff();
  const { data: departments, isLoading } = useDepartments();

  const [form, setForm] = useState<CreateStaffInput>({
    name: '',
    email: '',
    password: '',
    department_id: '',
    role: 'DOCTOR',
    job_title: '',
  });

  function updateField(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    mutation.mutate(form);
  }

  // Reset form after success
  useEffect(() => {
    if (mutation.isSuccess) {
      setForm({
        name: '',
        email: '',
        password: '',
        department_id: '',
        role: 'DOCTOR',
        job_title: '',
      });
    }
  }, [mutation.isSuccess]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
            <User size={14} className="text-indigo-600" />
            Full Name
          </label>
          <input
            name="name"
            placeholder="Dr. John Doe / Nurse Jane Smith"
            value={form.name}
            onChange={updateField}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Mail size={14} className="text-indigo-600" />
            Staff Email Address
          </label>
          <input
            type="email"
            name="email"
            placeholder="doctor.doe@hospital.com"
            value={form.email}
            onChange={updateField}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Temporary Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Lock size={14} className="text-indigo-600" />
            Temporary Password
          </label>
          <input
            type="password"
            name="password"
            placeholder="Assign initial secure password"
            value={form.password}
            onChange={updateField}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Department Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Building2 size={14} className="text-indigo-600" />
            Department
          </label>
          <select
            name="department_id"
            value={form.department_id}
            onChange={updateField}
            required
            disabled={isLoading}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all disabled:opacity-50 cursor-pointer"
          >
            <option value="">Select Hospital Department</option>
            {departments?.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>

        {/* Role Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Shield size={14} className="text-indigo-600" />
            System Role
          </label>
          <select
            name="role"
            value={form.role}
            onChange={updateField}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
          >
            <option value="DOCTOR">Doctor (Consultations & Admissions)</option>
            <option value="NURSE">Nurse (Inpatient Care & Bed Management)</option>
          </select>
        </div>

        {/* Job Title Dropdown */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
            <Briefcase size={14} className="text-indigo-600" />
            Clinical Job Title
          </label>
          <select
            name="job_title"
            value={form.job_title}
            onChange={updateField}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
          >
            <option value="">Select Professional Title</option>
            {JOB_TITLES.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Status Feedback */}
      {mutation.isSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>Staff account provisioned successfully! Credentials are active immediately.</span>
        </div>
      )}

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3 text-sm animate-in fade-in duration-200">
          <AlertCircle size={18} className="text-red-600 shrink-0" />
          <span>Failed to provision staff account. Please verify input data or uniqueness of email.</span>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-medium text-sm transition-all shadow-sm shadow-indigo-200 hover:shadow-md hover:shadow-indigo-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
        >
          {mutation.isPending ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Provisioning Staff...</span>
            </>
          ) : (
            <>
              <PlusCircle size={16} />
              <span>Create Staff Account</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}