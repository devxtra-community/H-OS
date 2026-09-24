'use client';

import { useState } from 'react';
import { useCreateWard } from '../hooks/useCreateWard';
import { Building2, PlusCircle, CheckCircle2, AlertCircle } from 'lucide-react';

export default function CreateWardForm() {
  const [name, setName] = useState('');
  const mutation = useCreateWard();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    mutation.mutate({ name }, {
      onSuccess: () => {
        setName('');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
          <Building2 size={14} className="text-emerald-600" />
          Ward / Wing Name
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Intensive Care Unit (ICU), General Ward B, Pediatrics Wing"
            required
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 text-gray-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={mutation.isPending || !name.trim()}
            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-sm transition-all shadow-sm shadow-emerald-200 hover:shadow-md hover:shadow-emerald-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {mutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Creating...</span>
              </>
            ) : (
              <>
                <PlusCircle size={16} />
                <span>Create Ward</span>
              </>
            )}
          </button>
        </div>
      </div>

      {mutation.isSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm animate-in fade-in duration-200">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <span>Hospital ward created successfully! It is now available for room setup.</span>
        </div>
      )}

      {mutation.isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2.5 text-sm animate-in fade-in duration-200">
          <AlertCircle size={18} className="text-red-600 shrink-0" />
          <span>Failed to create ward. Please try again.</span>
        </div>
      )}
    </form>
  );
}