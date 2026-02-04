// services/patient-service/src/modules/patients/patient.types.ts
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface CreatePatientDTO {
  name: string;
  email: string;
  dob: string;
  gender: Gender;
  phone?: string;
}

export interface UpdatePatientDTO {
  name?: string;
  dob?: string;
  gender?: Gender;
  phone?: string;
}

export interface PatientResponse {
  id: string;
  name: string;
  email: string;
  dob: Date;
  gender: Gender;
  phone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
