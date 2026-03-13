import CreateStaffForm from "@/src/features/admin/components/CreateStaffForm";
import CreateWardForm from "@/src/features/admin/components/CreateWardForm";
import CreateRoomForm from "@/src/features/admin/components/CreateRoomForm";
import CreateBedForm from "@/src/features/admin/components/CreateBedForm";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12"> {/* Narrower container for better readability */}
        
        {/* Page Header */}
        <header className="border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
          <p className="text-gray-500">Add new staff members and hospital infrastructure</p>
        </header>

        {/* Form 1: Staff */}
        <section className="bg-white shadow-md border rounded-xl overflow-hidden">
          <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
            <h2 className="text-lg font-bold text-blue-900">1. Staff Registration</h2>
          </div>
          <div className="p-8">
            <CreateStaffForm />
          </div>
        </section>

        {/* Form 2: Wards */}
        <section className="bg-white shadow-md border rounded-xl overflow-hidden">
          <div className="bg-green-50 px-6 py-4 border-b border-green-100">
            <h2 className="text-lg font-bold text-green-900">2. Ward Management</h2>
          </div>
          <div className="p-8">
            <CreateWardForm />
          </div>
        </section>

        {/* Form 3: Rooms */}
        <section className="bg-white shadow-md border rounded-xl overflow-hidden">
          <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
            <h2 className="text-lg font-bold text-purple-900">3. Room Assignment</h2>
          </div>
          <div className="p-8">
            <CreateRoomForm />
          </div>
        </section>

        {/* Form 4: Beds */}
        <section className="bg-white shadow-md border rounded-xl overflow-hidden">
          <div className="bg-amber-50 px-6 py-4 border-b border-amber-100">
            <h2 className="text-lg font-bold text-amber-900">4. Bed Setup</h2>
          </div>
          <div className="p-8">
            <CreateBedForm />
          </div>
        </section>

      </div>
    </div>
  );
}