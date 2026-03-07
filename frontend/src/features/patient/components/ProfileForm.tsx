'use client';

import { useEffect, useState } from 'react';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { uploadProfileImage } from '../api/updateProfileImage';
import {
  Activity, PhoneCall, Pencil, Save, X, Droplets, Ruler,
  Weight, Fingerprint, HeartPulse, Calendar, VenetianMask
} from 'lucide-react';

export default function ProfileForm() {
  const { data, isLoading } = usePatientProfile();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', dob: '', gender: '',
    blood_group: '', height_cm: '', weight_kg: '', address_line1: '',
    city: '', pincode: '', emergency_contact_name: '',
    emergency_contact_phone: '', emergency_contact_relation: '', profile_image: ''
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

  if (isLoading || !data) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
      </div>
    </div>
  );

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imageUrl = await uploadProfileImage(file);
      setForm(prev => ({ ...prev, profile_image: imageUrl }));
    } catch (err) { console.error("Upload failed", err); }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateProfile.mutate(form, { onSuccess: () => setIsEditing(false) });
  }

  const ageValue = (dob?: string) => {
    if (!dob) return '—';
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
    return age >= 0 ? age : '—';
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats Card */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <label className="relative cursor-pointer group">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              <div className="h-24 w-24 rounded-[2rem] overflow-hidden bg-slate-200 flex items-center justify-center shadow-lg">
                {form.profile_image ? <img src={form.profile_image} className="h-full w-full object-cover" /> : 
                <div className="h-full w-full bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold">{form.name?.charAt(0)}</div>}
              </div>
            </label>
            <div className="space-y-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{form.name || 'Patient Profile'}</h1>
              <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                <Activity size={16} className="text-emerald-500"/> Medical Profile Verified
              </div>
            </div>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all ${isEditing ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-white'}`}>
            {isEditing ? <><X size={18}/> Cancel</> : <><Pencil size={18}/> Edit Profile</>}
          </button>
        </div>

        {/* --- EDITABLE STATS GRID --- */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
          <StatBox label="Gender" icon={<VenetianMask className="text-indigo-500" size={18}/>}>
            {isEditing ? (
              <select name="gender" value={form.gender} onChange={handleChange} className="w-full bg-transparent font-bold text-slate-900 text-lg outline-none border-b border-blue-500">
                <option value="MALE">Male</option><option value="FEMALE">Female</option><option value="OTHER">Other</option>
              </select>
            ) : <p className="font-bold text-slate-900 text-lg uppercase">{form.gender || '—'}</p>}
          </StatBox>

          <StatBox label="Blood Group" icon={<Droplets className="text-red-500" size={18}/>}>
            {isEditing ? (
              <select name="blood_group" value={form.blood_group} onChange={handleChange} className="w-full bg-transparent font-bold text-slate-900 text-lg outline-none border-b border-blue-500">
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            ) : <p className="font-bold text-slate-900 text-lg">{form.blood_group || '—'}</p>}
          </StatBox>

          <StatBox label="Height" icon={<Ruler className="text-blue-500" size={18}/>}>
            {isEditing ? (
              <div className="flex items-center border-b border-blue-500"><input type="number" name="height_cm" value={form.height_cm} onChange={handleChange} className="w-full bg-transparent font-bold text-slate-900 text-lg outline-none" /><span className="text-xs text-slate-400">CM</span></div>
            ) : <p className="font-bold text-slate-900 text-lg">{form.height_cm ? `${form.height_cm} cm` : '—'}</p>}
          </StatBox>

          <StatBox label="Weight" icon={<Weight className="text-emerald-500" size={18}/>}>
            {isEditing ? (
              <div className="flex items-center border-b border-blue-500"><input type="number" name="weight_kg" value={form.weight_kg} onChange={handleChange} className="w-full bg-transparent font-bold text-slate-900 text-lg outline-none" /><span className="text-xs text-slate-400">KG</span></div>
            ) : <p className="font-bold text-slate-900 text-lg">{form.weight_kg ? `${form.weight_kg} kg` : '—'}</p>}
          </StatBox>

          <StatBox label="Age" icon={<Calendar className="text-orange-500" size={18}/>}><p className="font-bold text-slate-900 text-lg">{ageValue(form.dob)} Yrs</p></StatBox>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60 h-full">
            <div className="flex items-center gap-3 mb-10 text-slate-800"><Fingerprint size={22}/><h2 className="text-xl font-bold">Personal Details</h2></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <ModernInput label="Full Name" name="name" value={form.name} onChange={handleChange} disabled={!isEditing}/>
              <ModernInput label="Email Address" name="email" value={form.email} onChange={handleChange} disabled={!isEditing}/>
              <ModernInput label="Phone Number" name="phone" value={form.phone} onChange={handleChange} disabled={!isEditing}/>
              <ModernInput label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} disabled={!isEditing}/>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200/60">
            <div className="flex items-center gap-3 mb-8 text-rose-600"><PhoneCall size={20}/><h2 className="font-bold text-slate-800">Emergency Contact</h2></div>
            <div className="space-y-6">
              <ModernInput label="Contact Name" name="emergency_contact_name" value={form.emergency_contact_name} onChange={handleChange} disabled={!isEditing}/>
              <ModernInput label="Relation" name="emergency_contact_relation" value={form.emergency_contact_relation} onChange={handleChange} disabled={!isEditing}/>
              <ModernInput label="Phone" name="emergency_contact_phone" value={form.emergency_contact_phone} onChange={handleChange} disabled={!isEditing}/>
            </div>
          </section>
          {isEditing && <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-[2rem] font-bold shadow-xl shadow-blue-200 transition-all active:scale-[0.98]">SAVE PROFILE</button>}
        </div>
      </form>
    </div>
  );
}

function StatBox({ label, icon, children }: any) {
  return (
    <div className="flex flex-col gap-2 p-5 bg-slate-50/50 rounded-[2rem] border border-slate-100 justify-center">
      <div className="flex items-center justify-between opacity-80"><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>{icon}</div>
      {children}
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
        // FIX: Ensure value is never null or undefined
        value={value ?? ''} 
        onChange={onChange} 
        disabled={disabled} 
        className={`w-full px-5 py-4 rounded-2xl text-slate-900 font-medium outline-none border-2 ${
          disabled 
            ? 'bg-transparent border-transparent cursor-default' 
            : 'bg-slate-50 border-slate-50 focus:bg-white focus:border-blue-500/20'
        }`} 
      />
    </div>
  );
}