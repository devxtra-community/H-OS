import DoctorPatients from "@/src/features/admissions/components/DoctorPatients"

export default function DoctorPatientsPage(){
    return (
      <div className='mih-h-screen bg-gray-50 p-8' >
        <h1 className='text-2xl font-semibold mb-6' >
           My Admitted Patients
        </h1>
        <DoctorPatients />
      </div>
    )
}




