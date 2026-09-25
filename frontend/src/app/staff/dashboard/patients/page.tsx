import DoctorPatients from "@/src/features/admissions/components/DoctorPatients";
import { UserCheck } from "lucide-react";

export default function DoctorPatientsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm shadow-emerald-500/20">
          <UserCheck size={20} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            My Admitted Patients
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Monitor admitted inpatients under your care, medical consumables, and discharge requests
          </p>
        </div>
      </div>

      <DoctorPatients />
    </div>
  );
}
