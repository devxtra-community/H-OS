'use client';

import { useEffect, useState } from 'react';
import { usePatientProfile } from '../hooks/usePatientProfile';
import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { 
  User, 
  Activity, 
  MapPin, 
  PhoneCall, 
  Pencil, 
  Save, 
  X, 
  Droplets, 
  Ruler, 
  Weight, 
  Calendar,
  ShieldAlert,
  Mail,
  Phone,
  Fingerprint
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
    blood_group: '',
    height_cm: '',
    weight_kg: '',
    allergies: '',
    chronic_conditions: '',
    address_line1: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    emergency_contact_relation: ''
  });

  useEffect(() => {
    if (!data) return;
    setForm({
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      dob: data.dob || '',
      blood_group: data.blood_group || '',
      height_cm: data.height_cm || '',
      weight_kg: data.weight_kg || '',
      allergies: data.allergies || '',
      chronic_conditions: data.chronic_conditions || '',
      address_line1: data.address_line1 || '',
      city: data.city || '',
      state: data.state || '',
      country: data.country || '',
      pincode: data.pincode || '',
      emergency_contact_name: data.emergency_contact_name || '',
      emergency_contact_phone: data.emergency_contact_phone || '',
      emergency_contact_relation: data.emergency_contact_relation || ''
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(form, {
      onSuccess: () => setIsEditing(false)
    });
  };

  const age = data?.dob ? new Date().getFullYear() - new Date(data.dob).getFullYear() : '—';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-50/50 rounded-full -mr-20 -mt-20 blur-3xl" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-100">
              {form.name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{form.name}</h1>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-widest">
                  Patient ID: {data.id?.slice(-6).toUpperCase() || 'H-OS-092'}
                </span>
                <span className="text-slate-400 text-sm font-medium flex items-center gap-1">
                  <Activity size={14} className="text-emerald-500" /> Account Active
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200"
              >
                <Pencil size={18} /> Edit Profile
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all"
              >
                <X size={18} /> Cancel
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-slate-100">
          <StatBox label="Blood Type" value={form.blood_group || 'Unknown'} icon={<Droplets className="text-red-500" size={16} />} />
          <StatBox label="Height" value={form.height_cm ? `${form.height_cm} cm` : '—'} icon={<Ruler className="text-blue-500" size={16} />} />
          <StatBox label="Weight" value={form.weight_kg ? `${form.weight_kg} kg` : '—'} icon={<Weight className="text-emerald-500" size={16} />} />
          <StatBox label="Age" value={`${age} Years`} icon={<User className="text-indigo-500" size={16} />} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PERSONAL IDENTITY SECTION */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <header className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><Fingerprint size={20}/></div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Personal Identity</h2>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FloatingInput label="Full Name" name="name" value={form.name} onChange={handleChange} disabled={!isEditing} icon={<User size={16}/>} />
              </div>
              <FloatingInput label="Email Address" name="email" value={form.email} onChange={handleChange} disabled={!isEditing} icon={<Mail size={16}/>} />
              <FloatingInput label="Phone Number" name="phone" value={form.phone} onChange={handleChange} disabled={!isEditing} icon={<Phone size={16}/>} />
              <div className="md:col-span-2">
                <FloatingInput label="Date of Birth" name="dob" type="date" value={form.dob} onChange={handleChange} disabled={!isEditing} icon={<Calendar size={16}/>} />
              </div>
            </div>
          </section>

          {/* CLINICAL BACKGROUND */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <header className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-rose-50 rounded-xl text-rose-600"><ShieldAlert size={20}/></div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Background</h2>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Physical Metrics</label>
                <div className="grid grid-cols-2 gap-4">
                  <FloatingInput label="Blood Type" name="blood_group" value={form.blood_group} onChange={handleChange} disabled={!isEditing} />
                  <FloatingInput label="Height (cm)" name="height_cm" value={form.height_cm} onChange={handleChange} disabled={!isEditing} />
                  <FloatingInput label="Weight (kg)" name="weight_kg" value={form.weight_kg} onChange={handleChange} disabled={!isEditing} />
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Medical Notes</label>
                <textarea 
                  name="allergies" 
                  value={form.allergies} 
                  onChange={handleChange} 
                  disabled={!isEditing}
                  placeholder="Record allergies or sensitivities..."
                  className="w-full bg-slate-50 border-slate-200 rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-all min-h-27.5 disabled:bg-slate-50/50 resize-none"
                />
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* EMERGENCY SECTION */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <header className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-amber-50 rounded-xl text-amber-600"><PhoneCall size={20}/></div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Emergency Contact</h2>
            </header>
            
            <div className="space-y-5">
              <FloatingInput label="Contact Name" name="emergency_contact_name" value={form.emergency_contact_name} onChange={handleChange} disabled={!isEditing} />
              <FloatingInput label="Emergency Phone" name="emergency_contact_phone" value={form.emergency_contact_phone} onChange={handleChange} disabled={!isEditing} />
              <FloatingInput label="Relationship" name="emergency_contact_relation" value={form.emergency_contact_relation} onChange={handleChange} disabled={!isEditing} />
            </div>
          </section>

          {/* ADDRESS SECTION */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <header className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><MapPin size={20}/></div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Residency</h2>
            </header>
            
            <div className="space-y-5">
              <FloatingInput label="Street Address" name="address_line1" value={form.address_line1} onChange={handleChange} disabled={!isEditing} />
              <div className="grid grid-cols-2 gap-4">
                <FloatingInput label="City" name="city" value={form.city} onChange={handleChange} disabled={!isEditing} />
                <FloatingInput label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} disabled={!isEditing} />
              </div>
            </div>
          </section>

          {isEditing && (
            <div className="sticky bottom-6 bg-blue-600 rounded-3xl p-6 text-white shadow-2xl shadow-blue-300 animate-in zoom-in-95 duration-300">
              <h3 className="font-bold flex items-center gap-2 mb-2"><Activity size={18}/> Review Updates</h3>
              <p className="text-xs text-blue-100 mb-6 font-medium">Please verify the contact and medical data accuracy before saving to the central database.</p>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-white text-blue-600 py-4 rounded-2xl font-black hover:shadow-lg transition-all active:scale-95"
              >
                <Save size={20} /> SYNC PROFILE
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

/* HELPER COMPONENTS */

function StatBox({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100/50">
      <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100">{icon}</div>
      <div>
        <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter leading-none mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

function FloatingInput({ label, name, value, onChange, disabled, type = "text", icon }: any) {
  return (
    <div className="group relative flex flex-col gap-1.5 w-full">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-black text-slate-400 group-focus-within:text-blue-600 uppercase tracking-widest transition-colors">
          {label}
        </label>
        {icon && <span className="text-slate-300 group-focus-within:text-blue-400 transition-colors">{icon}</span>}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold tracking-tight transition-all
          focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:bg-white outline-none
          disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50/20 disabled:border-slate-100 disabled:font-medium
        `}
      />
    </div>
  );
}