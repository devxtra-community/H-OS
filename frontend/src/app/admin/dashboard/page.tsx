import CreateStaffForm from "@/src/features/admin/components/CreateStaffForm";


export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold">
        Admin Dashboard
      </h1>

      <p>Welcome Admin</p>

      <div className="space-y-8" >
         <CreateStaffForm />
      </div>
    </div>
  );
}