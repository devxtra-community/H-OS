export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface CreatePatientDTO {
  email: string;
  password: string;
  name: string;
  dob: string;
  gender: string;
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
