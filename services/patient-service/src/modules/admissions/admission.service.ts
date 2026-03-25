import { admissionRepository } from './admission.repository';
import axios from 'axios';

class AdmissionService {
  async requestAdmission(data: any) {
    return admissionRepository.createAdmission(data);
  }

  async getPendingAdmissions() {
    const admissions = await admissionRepository.getPendingAdmissions();

    if (!admissions || admissions.length === 0) return [];

    const doctorIds = admissions.map((a: any) => a.doctor_id);

    try {
      const response = await axios.post(
        `${process.env.STAFF_SERVICE_URL}/staff/bulk-basic-info`,
        {
          staffIds: doctorIds,
        }
      );
      const staffInfo = response.data || [];

      return admissions.map((admission: any) => {
        const doc = staffInfo.find((s: any) => s.id === admission.doctor_id);
        return {
          ...admission,
          doctor_name: doc?.doctor_name || 'Unknown Doctor',
          department_name: doc?.department_name || 'Unknown Department',
        };
      });
    } catch (err) {
      console.error('Failed to fetch doctor names', err);
      return admissions;
    }
  }

  async admitPatient(admissionId: string) {
    return admissionRepository.markAdmitted(admissionId);
  }

  async requestDischarge(admissionId: string) {
    await admissionRepository.requestDischarge(admissionId);
  }

  async completeDischarge(admissionId: string) {
    await admissionRepository.completeDischarge(admissionId);
  }

  async getDoctorAdmissions(doctorId: string) {
    const admissions = await admissionRepository.getDoctorAdmissions(doctorId);

    if (!admissions || admissions.length === 0) return [];

    const patientIds = admissions.map((a: any) => a.patient_id);

    try {
      const response = await axios.post(
        `${process.env.STAFF_SERVICE_URL}/staff/beds/active-assignments`,
        {
          patientIds,
        }
      );
      const activeAssignments = response.data || [];

      return admissions.map((admission: any) => {
        const assignment = activeAssignments.find(
          (b: any) => b.patient_id === admission.patient_id
        );
        return {
          ...admission,
          ward: assignment?.ward || 'Unassigned',
          bed_number: assignment?.bed_number || 'Unassigned',
        };
      });
    } catch (err) {
      console.error('Failed to fetch bed assignments', err);
      return admissions;
    }
  }
  async getDischargeRequests() {
    const requests = await admissionRepository.getDischargeRequests();

    if (!requests || requests.length === 0) return [];

    const patientIds = requests.map((r: any) => r.patient_id);

    try {
      const response = await axios.post(
        `${process.env.STAFF_SERVICE_URL}/staff/beds/active-assignments`,
        {
          patientIds,
        }
      );
      const activeAssignments = response.data || [];

      return requests.map((request: any) => {
        const assignment = activeAssignments.find(
          (b: any) => b.patient_id === request.patient_id
        );
        return {
          ...request,
          ward: assignment?.ward || 'Unassigned',
          bed_number: assignment?.bed_number || 'Unassigned',
        };
      });
    } catch (err) {
      console.error('Failed to fetch bed assignments', err);
      return requests;
    }
  }
}

export const admissionService = new AdmissionService();
