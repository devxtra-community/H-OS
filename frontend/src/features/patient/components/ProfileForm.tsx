'use client';

import { useEffect, useState } from 'react';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { uploadProfileImage } from '../api/updateProfileImage';

import {
  Activity,
  MapPin,
  PhoneCall,
  Pencil,
  Save,
  X,
  Droplets,
  Ruler,
  Weight,
  Fingerprint,
  HeartPulse,
  Calendar,
  VenetianMask
} from 'lucide-react';

export default function ProfileForm() {

  const { data, isLoading } = usePatientProfile();
  const updateProfile = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);

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
    profile_image: ''
  });

  useEffect(() => {

    if (!data) return;

    setForm(prev => ({
      ...prev,
      ...data,
      dob: data.dob ? data.dob.split('T')[0] : '',
      height_cm: data.height_cm ? String(data.height_cm) : '',
      weight_kg: data.weight_kg ? String(data.weight_kg) : '',
      gender: data.gender || '',
      profile_image: data.profile_image || ''
    }));

  }, [data]);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
          <HeartPulse className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-600" size={20}/>
        </div>
      </div>
    );
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

  }

  function handleSubmit(e: React.FormEvent) {

    e.preventDefault();

    updateProfile.mutate(form, {
      onSuccess: () => setIsEditing(false)
    });

  }

  const ageValue = (dob?: string) => {

    if (!dob) return '—';

    const birth = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();

    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
      today.getDate() < birth.getDate())
    ) age--;

    return age >= 0 ? age : '—';

  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4">

      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}

        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

            <div className="flex items-center gap-6">

              {/* Avatar */}

              <label className="relative cursor-pointer group">

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {

                    const file = e.target.files?.[0];
                    if (!file) return;

                    const imageUrl = await uploadProfileImage(file);

                    setForm(prev => ({
                      ...prev,
                      profile_image: imageUrl
                    }));

                  }}
                />

                <div className="h-24 w-24 rounded-4xl overflow-hidden bg-slate-200 shadow-xl shadow-blue-100 flex items-center justify-center">

                  {form.profile_image ? (

                    <img
                      src={form.profile_image}
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <div className="h-full w-full bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold">
                      {form.name?.charAt(0)}
                    </div>

                  )}

                </div>

                <div className="absolute inset-0 rounded-4xl bg-black/0 group-hover:bg-black/20 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition">
                  Change
                </div>

              </label>

              <div className="space-y-1">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {form.name || 'Patient Profile'}
                </h1>

                <div className="flex items-center gap-2 text-slate-500 font-medium">
                  <Activity size={16} className="text-emerald-500"/>
                  <span className="text-sm">Medical Profile Verified</span>
                </div>
              </div>

            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all duration-200 ${
                isEditing
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  : 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200'
              }`}
            >
              {isEditing ? <><X size={18}/> Cancel</> : <><Pencil size={18}/> Edit Profile</>}
            </button>

          </div>

          {/* Stats */}

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-10">

            <StatBox label="Gender" icon={<VenetianMask className="text-indigo-500" size={18}/>}>
              {isEditing ? (
                <select name="gender" value={form.gender} onChange={handleChange}
                  className="w-full bg-transparent font-bold text-slate-900 text-lg outline-none border-b-2 border-blue-500/30 focus:border-blue-500">
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              ) : (
                <p className="font-bold text-slate-900 text-lg uppercase">{form.gender || '—'}</p>
              )}
            </StatBox>

            <StatBox label="Blood Group" icon={<Droplets className="text-red-500" size={18}/>}>
              {isEditing ? (
                <select name="blood_group" value={form.blood_group} onChange={handleChange}
                  className="w-full bg-transparent font-bold text-slate-900 text-lg outline-none border-b-2 border-blue-500/30 focus:border-blue-500">
                  <option value="">N/A</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              ) : (
                <p className="font-bold text-slate-900 text-lg">{form.blood_group || '—'}</p>
              )}
            </StatBox>

            <StatBox label="Height" icon={<Ruler className="text-blue-500" size={18}/>}>
              {isEditing ? (
                <div className="flex items-baseline gap-1 border-b-2 border-blue-500/30 focus-within:border-blue-500">
                  <input type="number" name="height_cm" value={form.height_cm} onChange={handleChange}
                    className="w-full bg-transparent font-bold text-slate-900 text-lg outline-none"/>
                  <span className="text-[10px] font-bold text-slate-400">CM</span>
                </div>
              ) : (
                <p className="font-bold text-slate-900 text-lg">{form.height_cm ? `${form.height_cm} cm` : '—'}</p>
              )}
            </StatBox>

            <StatBox label="Weight" icon={<Weight className="text-emerald-500" size={18}/>}>
              {isEditing ? (
                <div className="flex items-baseline gap-1 border-b-2 border-blue-500/30 focus-within:border-blue-500">
                  <input type="number" name="weight_kg" value={form.weight_kg} onChange={handleChange}
                    className="w-full bg-transparent font-bold text-slate-900 text-lg outline-none"/>
                  <span className="text-[10px] font-bold text-slate-400">KG</span>
                </div>
              ) : (
                <p className="font-bold text-slate-900 text-lg">{form.weight_kg ? `${form.weight_kg} kg` : '—'}</p>
              )}
            </StatBox>

            <StatBox label="Age" icon={<Calendar className="text-orange-500" size={18}/>}>
              <p className="font-bold text-slate-900 text-lg">{ageValue(data?.dob)} Yrs</p>
            </StatBox>

          </div>

        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Personal */}

          <div className="lg:col-span-2 space-y-8">

            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60">

              <div className="flex items-center gap-3 mb-10">
                <div className="p-2.5 bg-slate-100 rounded-2xl text-slate-600">
                  <Fingerprint size={22}/>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Personal Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">

                <ModernInput label="Full Name" name="name" value={form.name} onChange={handleChange} disabled={!isEditing}/>
                <ModernInput label="Email Address" name="email" value={form.email} onChange={handleChange} disabled={!isEditing}/>
                <ModernInput label="Phone Number" name="phone" value={form.phone} onChange={handleChange} disabled={!isEditing}/>
                <ModernInput label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} disabled={!isEditing}/>

              </div>

            </section>

          </div>

          {/* Right side */}

          <div className="space-y-8">

            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60">

              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-rose-50 rounded-2xl text-rose-600">
                  <PhoneCall size={20}/>
                </div>
                <h2 className="font-bold text-slate-800">Emergency Contact</h2>
              </div>

              <div className="space-y-6">

                <ModernInput label="Contact Name" name="emergency_contact_name" value={form.emergency_contact_name} onChange={handleChange} disabled={!isEditing}/>

                <ModernInput label="Relation" name="emergency_contact_relation" value={form.emergency_contact_relation} onChange={handleChange} disabled={!isEditing}/>

                <ModernInput label="Phone" name="emergency_contact_phone" value={form.emergency_contact_phone} onChange={handleChange} disabled={!isEditing}/>

              </div>

            </section>

            {isEditing && (
              <button type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-4xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-blue-200 transition-all active:scale-[0.98]">
                <Save size={22}/>
                SAVE PROFILE
              </button>
            )}

          </div>

        </form>

      </div>
    </div>
  );
}

/* Helper Components */

function StatBox({ label, icon, children }: any) {
  return (
    <div className="flex flex-col gap-2 p-5 bg-slate-50/50 rounded-4xl border border-slate-100 min-h-26.25 justify-center">
      <div className="flex items-center justify-between opacity-80">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
        {icon}
      </div>
      <div className="mt-1">{children}</div>
    </div>
  );
}

function ModernInput({ label, name, value, onChange, disabled, type="text" }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full px-5 py-4 rounded-2xl text-slate-900 font-medium transition-all outline-none border-2
          ${disabled 
            ? 'bg-transparent border-transparent cursor-default px-1' 
            : 'bg-slate-50 border-slate-50 focus:bg-white focus:border-blue-500/20 focus:ring-4 focus:ring-blue-500/5'
          }`}
      />
    </div>
  );
}