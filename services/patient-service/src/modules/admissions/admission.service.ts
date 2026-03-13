import { admissionRepository } from './admission.repository';

class AdmissionService {
  async requestAdmission(data: any) {
    return admissionRepository.createAdmission(data);
  }

  async getPendingAdmissions() {
    return admissionRepository.getPendingAdmissions();
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
    return admissionRepository.getDoctorAdmissions(doctorId);
  }
  async getDischargeRequests() {
    return admissionRepository.getDischargeRequests();
  }
}

export const admissionService = new AdmissionService();
