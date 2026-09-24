'use client';

import { useEffect, useState } from 'react';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { uploadProfileImage } from '../api/updateProfileImage';
import {
  Activity,
  PhoneCall,
  Pencil,
  Save,
  X,
  Droplets,
  Ruler,
  Weight,
  Calendar,
  Users,
  Mail,
  Phone,
  ShieldCheck,
  Camera,
  CheckCircle2,
  AlertCircle,
  HeartHandshake,
  User,
  HeartPulse,
} from 'lucide-react';

export default function ProfileForm() {
  const { data, isLoading } = usePatientProfile();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    blood_group: '',
    height_cm: '',
    weight_kg: '',
    address_line1: '',
    city: '',
    pincode: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: '',
    profile_image: '',
  });

  useEffect(() => {
    if (!data) return;
    setForm((prev) => ({
      ...prev,
      ...data,
      dob: data.dob ? data.dob.split('T')[0] : '',
      height_cm: data.height_cm ? String(data.height_cm) : '',
      weight_kg: data.weight_kg ? String(data.weight_kg) : '',
      gender: data.gender || '',
      profile_image: data.profile_image || '',
    }));
  }, [data]);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="relative flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-3 border-indigo-100 border-t-indigo-600 animate-spin" />
          <p className="text-xs font-medium text-slate-400">Loading patient profile...</p>
        </div>
      </div>
    );
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const imageUrl = await uploadProfileImage(file);
      setForm((prev) => ({ ...prev, profile_image: imageUrl }));
    } catch (err) {
      console.error('Profile image upload failed:', err);
    } finally {
      setIsUploadingImage(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaveSuccess(false);
    updateProfile.mutate(form, {
      onSuccess: () => {
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
      },
    });
  }

  function handleCancel() {
    if (data) {
      setForm({
        ...data,
        dob: data.dob ? data.dob.split('T')[0] : '',
        height_cm: data.height_cm ? String(data.height_cm) : '',
        weight_kg: data.weight_kg ? String(data.weight_kg) : '',
        gender: data.gender || '',
        profile_image: data.profile_image || '',
      });
    }
    setIsEditing(false);
  }

  const ageValue = (dob?: string) => {
    if (!dob) return '—';
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age >= 0 ? age : '—';
  };

  const formattedDob = (dob?: string) => {
    if (!dob) return 'Not recorded';
    try {
      const date = new Date(dob);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      });
    } catch {
      return dob;
    }
  };

  const patientIdShort = data.id ? data.id.slice(0, 8).toUpperCase() : 'PATIENT';

  return (
    <div className="space-y-6">
      {/* Save Success Banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between text-sm shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span className="font-medium">Profile updated successfully!</span>
          </div>
          <button
            type="button"
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-600 hover:text-emerald-800 cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Save Error Banner */}
      {updateProfile.isError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-2xl flex items-center gap-2.5 text-sm shadow-xs animate-in fade-in duration-200">
          <AlertCircle size={18} className="text-rose-600 shrink-0" />
          <span className="font-medium">Failed to update profile. Please try again.</span>
        </div>
      )}

      {/* TOP IDENTITY & CLINICAL VITALS CARD */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
        {/* Header Row: Avatar, Identity & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5 sm:gap-6">
            {/* Avatar with Camera Overlay */}
            <label className="relative group cursor-pointer shrink-0">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={isUploadingImage}
              />
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden bg-slate-100 ring-4 ring-slate-100 shadow-sm relative">
                {form.profile_image ? (
                  <img
                    src={form.profile_image}
                    alt={form.name || 'Patient'}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full hos-gradient-bg flex items-center justify-center text-white text-2xl sm:text-3xl font-bold shadow-inner">
                    {form.name?.charAt(0)?.toUpperCase() || 'P'}
                  </div>
                )}

                {/* Hover Camera Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 backdrop-blur-xs">
                  {isUploadingImage ? (
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Camera size={18} />
                      <span className="text-[10px] font-semibold mt-1">Change</span>
                    </>
                  )}
                </div>
              </div>
            </label>

            {/* Name & Medical Status Badges */}
            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight truncate">
                  {form.name || 'Patient Profile'}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  Verified Patient
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span className="font-mono text-slate-400">ID: #{patientIdShort}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 flex items-center gap-1">
                  <Activity size={12} className="text-indigo-600" />
                  Active Records
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <X size={14} />
                  <span>Cancel</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={updateProfile.isPending}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-semibold transition-all shadow-sm shadow-indigo-200 hover:shadow-md flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {updateProfile.isPending ? (
                    <>
                      <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={14} />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-98"
              >
                <Pencil size={14} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* CLINICAL VITALS / PHYSICAL ATTRIBUTES RIBBON */}
        <div className="pt-6 border-t border-slate-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3.5 flex items-center gap-1.5">
            <HeartPulse size={13} className="text-indigo-600" />
            Clinical Vitals &amp; Biometrics
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Gender */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Gender</span>
                <Users size={15} className="text-indigo-600" />
              </div>
              {isEditing ? (
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              ) : (
                <p className="text-base font-bold text-slate-900 uppercase">
                  {form.gender || '—'}
                </p>
              )}
            </div>

            {/* Blood Group */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Blood Group</span>
                <Droplets size={15} className="text-rose-600" />
              </div>
              {isEditing ? (
                <select
                  name="blood_group"
                  value={form.blood_group}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
                >
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-base font-bold text-slate-900">
                  {form.blood_group || '—'}
                </p>
              )}
            </div>

            {/* Height */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Height</span>
                <Ruler size={15} className="text-blue-600" />
              </div>
              {isEditing ? (
                <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1">
                  <input
                    type="number"
                    name="height_cm"
                    value={form.height_cm}
                    onChange={handleChange}
                    placeholder="175"
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
                  />
                  <span className="text-[11px] font-bold text-slate-400 ml-1">CM</span>
                </div>
              ) : (
                <p className="text-base font-bold text-slate-900">
                  {form.height_cm ? (
                    <>
                      {form.height_cm}
                      <span className="text-xs font-medium text-slate-400 ml-1">cm</span>
                    </>
                  ) : (
                    '—'
                  )}
                </p>
              )}
            </div>

            {/* Weight */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Weight</span>
                <Weight size={15} className="text-emerald-600" />
              </div>
              {isEditing ? (
                <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2.5 py-1">
                  <input
                    type="number"
                    name="weight_kg"
                    value={form.weight_kg}
                    onChange={handleChange}
                    placeholder="70"
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 outline-none"
                  />
                  <span className="text-[11px] font-bold text-slate-400 ml-1">KG</span>
                </div>
              ) : (
                <p className="text-base font-bold text-slate-900">
                  {form.weight_kg ? (
                    <>
                      {form.weight_kg}
                      <span className="text-xs font-medium text-slate-400 ml-1">kg</span>
                    </>
                  ) : (
                    '—'
                  )}
                </p>
              )}
            </div>

            {/* Calculated Age */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4 flex flex-col justify-between space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-wider">Age</span>
                <Calendar size={15} className="text-amber-600" />
              </div>
              <p className="text-base font-bold text-slate-900">
                {ageValue(form.dob)}
                <span className="text-xs font-medium text-slate-400 ml-1">Yrs</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FORM SECTIONS: PERSONAL DETAILS & EMERGENCY CONTACT */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Details Card (2/3 width) */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs h-full space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <User size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
                  <p className="text-xs text-slate-500">Legal patient identity and demographic records.</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Identity
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <User size={13} className="text-slate-400" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter full legal name"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-100 text-sm font-semibold text-slate-900 truncate">
                    {form.name || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <Mail size={13} className="text-slate-400" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-100 text-sm font-semibold text-slate-900 truncate">
                    {form.email || 'Not provided'}
                  </div>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <Phone size={13} className="text-slate-400" />
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-100 text-sm font-semibold text-slate-900">
                    {form.phone || <span className="text-slate-400 font-normal italic">Not recorded</span>}
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <Calendar size={13} className="text-slate-400" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all cursor-pointer"
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-100 text-sm font-semibold text-slate-900">
                    {formattedDob(form.dob)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact Card (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600">
                  <PhoneCall size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Emergency Contact</h2>
                  <p className="text-xs text-slate-500">Urgent hospital notification contact.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Contact Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Contact Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergency_contact_name"
                    value={form.emergency_contact_name}
                    onChange={handleChange}
                    placeholder="e.g. Sarah Doe"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-100 text-sm font-semibold text-slate-900">
                    {form.emergency_contact_name || (
                      <span className="text-slate-400 font-normal italic">Not recorded</span>
                    )}
                  </div>
                )}
              </div>

              {/* Relationship */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <HeartHandshake size={13} className="text-slate-400" />
                  Relationship
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="emergency_contact_relation"
                    value={form.emergency_contact_relation}
                    onChange={handleChange}
                    placeholder="e.g. Spouse, Parent, Friend"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-100 text-sm font-semibold text-slate-900 capitalize">
                    {form.emergency_contact_relation || (
                      <span className="text-slate-400 font-normal italic">Not specified</span>
                    )}
                  </div>
                )}
              </div>

              {/* Contact Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 uppercase tracking-wider">
                  <Phone size={13} className="text-slate-400" />
                  Contact Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="emergency_contact_phone"
                    value={form.emergency_contact_phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 999-0000"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all placeholder:text-slate-400"
                  />
                ) : (
                  <div className="px-4 py-3 rounded-xl bg-slate-50/70 border border-slate-100 text-sm font-semibold text-slate-900">
                    {form.emergency_contact_phone || (
                      <span className="text-slate-400 font-normal italic">Not recorded</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Note banner */}
            <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3.5 text-xs text-rose-800 flex items-start gap-2">
              <span className="text-rose-500 font-bold">•</span>
              <span>This individual will be contacted only in urgent clinical situations or hospital admission.</span>
            </div>
          </div>

          {/* Action Button (when editing) */}
          {isEditing && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-xs cursor-pointer"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={updateProfile.isPending}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white py-3.5 rounded-xl font-semibold text-sm shadow-sm shadow-indigo-200 hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {updateProfile.isPending ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save Profile</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}