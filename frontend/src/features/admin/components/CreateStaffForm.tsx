'use client';

import { useState, useEffect } from 'react';
import { useCreateStaff } from '../hooks/useCreateStaff';
import { useDepartments } from '../hooks/useDepartments';
import type { CreateStaffInput } from '../api/createStaff.api';

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
    setForm(prev => ({
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
    <div className="bg-white p-6 rounded-xl shadow-md max-w-lg">
      <h2 className="text-xl font-semibold mb-6">
        Create Staff Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Name */}
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={updateField}
          required
          className="w-full border p-3 rounded-lg"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={updateField}
          required
          className="w-full border p-3 rounded-lg"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Temporary Password"
          value={form.password}
          onChange={updateField}
          required
          className="w-full border p-3 rounded-lg"
        />

        {/* Department Dropdown */}
        <select
          name="department_id"
          value={form.department_id}
          onChange={updateField}
          required
          className="w-full border p-3 rounded-lg"
          disabled={isLoading}
        >
          <option value="">Select Department</option>

          {departments?.map(dep => (
            <option key={dep.id} value={dep.id}>
              {dep.name}
            </option>
          ))}
        </select>

        {/* Role Dropdown */}
        <select
          name="role"
          value={form.role}
          onChange={updateField}
          className="w-full border p-3 rounded-lg"
        >
          <option value="DOCTOR">Doctor</option>
          <option value="NURSE">Nurse</option>
        </select>

        {/* Job Title Dropdown */}
        <select
          name="job_title"
          value={form.job_title}
          onChange={updateField}
          required
          className="w-full border p-3 rounded-lg"
        >
          <option value="">Select Job Title</option>

          {JOB_TITLES.map(title => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-black text-white py-3 rounded-lg"
        >
          {mutation.isPending ? 'Creating...' : 'Create Staff'}
        </button>

        {mutation.isSuccess && (
          <p className="text-green-600 text-sm">
            Staff created successfully!
          </p>
        )}

        {mutation.isError && (
          <p className="text-red-600 text-sm">
            Failed to create staff.
          </p>
        )}
      </form>
    </div>
  );
}