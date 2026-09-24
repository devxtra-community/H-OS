'use client';

import { Check, Calendar, Building2, User, Clock } from 'lucide-react';

interface Props {
  step: number;
}

const steps = [
  { label: 'Date', icon: Calendar, description: 'Appointment Day' },
  { label: 'Department', icon: Building2, description: 'Medical Specialty' },
  { label: 'Specialist', icon: User, description: 'Physician on Duty' },
  { label: 'Time Slot', icon: Clock, description: 'Consultation Window' },
];

export default function BookingStepper({ step }: Props) {
  return (
    <div className="w-full mb-8">
      <div className="relative flex items-center justify-between">
        {/* Connecting Progress Line */}
        <div className="absolute top-5 left-8 right-8 h-0.5 bg-slate-200 -z-0">
          <div
            className="h-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{
              width: `${Math.min(100, Math.max(0, ((step - 1) / (steps.length - 1)) * 100))}%`,
            }}
          />
        </div>

        {/* Step Nodes */}
        {steps.map((item, index) => {
          const stepNumber = index + 1;
          const isCompleted = step > stepNumber;
          const isCurrent = step === stepNumber;

          return (
            <div
              key={item.label}
              className="relative z-10 flex flex-col items-center group cursor-default"
            >
              <div
                className={`h-10 w-10 rounded-2xl flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-xs ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-emerald-200'
                    : isCurrent
                    ? 'hos-gradient-bg text-white shadow-md shadow-indigo-200 ring-4 ring-indigo-50 scale-105'
                    : 'bg-white border border-slate-200 text-slate-400'
                }`}
              >
                {isCompleted ? (
                  <Check size={16} strokeWidth={2.5} />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>

              <div className="text-center mt-2.5 space-y-0.5">
                <p
                  className={`text-xs font-bold tracking-tight transition-colors ${
                    isCurrent
                      ? 'text-indigo-600'
                      : isCompleted
                      ? 'text-slate-900'
                      : 'text-slate-400'
                  }`}
                >
                  {item.label}
                </p>
                <p className="hidden sm:block text-[10px] font-medium text-slate-400">
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}