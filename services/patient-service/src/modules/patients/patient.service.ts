// services/patient-service/src/modules/patients/patient.service.ts
import { prisma } from '../../prisma';
import { Patient } from '@prisma/client';
import {
  CreatePatientDTO,
  UpdatePatientDTO,
  PatientResponse,
  Gender,
} from './patient.types';

class PatientService {
  async createPatient(dto: CreatePatientDTO): Promise<PatientResponse> {
    const existing = await prisma.patient.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new Error(`Patient with email ${dto.email} already exists`);
    }

    const patient = await prisma.patient.create({
      data: {
        name: dto.name,
        email: dto.email,
        dob: new Date(dto.dob),
        gender: dto.gender,
        phone: dto.phone ?? null,
        isActive: true,
      },
    });

    return this.mapToResponse(patient);
  }

  async getPatientById(id: string): Promise<PatientResponse | null> {
    const patient = await prisma.patient.findFirst({
      where: { id, isActive: true },
    });

    return patient ? this.mapToResponse(patient) : null;
  }

  async updatePatient(
    id: string,
    dto: UpdatePatientDTO
  ): Promise<PatientResponse> {
    const updated = await prisma.patient.update({
      where: { id },
      data: {
        name: dto.name,
        gender: dto.gender,
        phone: dto.phone,
        dob: dto.dob ? new Date(dto.dob) : undefined,
      },
    });

    return this.mapToResponse(updated);
  }

  async deactivatePatient(id: string): Promise<void> {
    await prisma.patient.update({
      where: { id },
      data: { isActive: false },
    });
  }

  private mapToResponse(patient: Patient): PatientResponse {
    return {
      id: patient.id,
      name: patient.name,
      email: patient.email,
      dob: patient.dob,
      gender: patient.gender as Gender,
      phone: patient.phone ?? undefined,
      isActive: patient.isActive,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };
  }
}

export const patientService = new PatientService();
