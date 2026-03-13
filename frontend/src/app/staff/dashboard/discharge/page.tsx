import DischargeRequests from "@/src/features/admissions/components/DischargeRequests";

export default function DischargeRequestsPage(){
    return(
        <div className=" min-h-screen bg-gray-50 p-8 space-y-8" >
            <h1 className="text-2xl font-semibold" >
          Discharge Requests
            </h1>
        <div>
            <DischargeRequests />
        </div>
        </div>
    )
}