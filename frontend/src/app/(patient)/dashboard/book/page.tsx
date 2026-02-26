import BookingForm from '../../../../features/appointments/components/BookingForm';

export default function BookPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 p-8">

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">
          Book Appointment
        </h1>
        <p className="text-gray-500 mt-1">
          Choose a department, doctor and available time slot.
        </p>
      </div>

      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-3xl">
        <BookingForm />
      </div>

    </div>
  );
}