// services/patient-service/src/modules/patients/patient.controller.ts
import { Request, Response, NextFunction } from 'express';
import { patientService } from './patient.service';
import { CreatePatientDTO, UpdatePatientDTO } from './patient.types';

type PatientParams = {
  id: string;
};

export const createPatient = async (
  req: Request<{}, {}, CreatePatientDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await patientService.createPatient(req.body);
    res.status(201).json(patient);
  } catch (err) {
    next(err);
  }
};

export const getPatient = async (
  req: Request<PatientParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await patientService.getPatientById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (err) {
    next(err);
  }
};

export const updatePatient = async (
  req: Request<PatientParams, {}, UpdatePatientDTO>,
  res: Response,
  next: NextFunction
) => {
  try {
    const patient = await patientService.updatePatient(req.params.id, req.body);
    res.json(patient);
  } catch (err) {
    next(err);
  }
};

export const deactivatePatient = async (
  req: Request<PatientParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    await patientService.deactivatePatient(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
