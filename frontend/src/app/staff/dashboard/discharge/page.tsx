import DischargeRequests from "@/src/features/admissions/components/DischargeRequests";
import { LogOut } from "lucide-react";

export default function DischargeRequestsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-600 text-white shadow-sm shadow-amber-500/20">
          <LogOut size={20} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Patient Discharge Requests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review physician-cleared patient discharges and release inpatient beds back to inventory
          </p>
        </div>
      </div>

      <DischargeRequests />
    </div>
  );
}