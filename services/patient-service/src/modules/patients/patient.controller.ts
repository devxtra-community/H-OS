// services/patient-service/src/modules/patients/patient.controller.ts
import { Request, Response } from 'express';
import { patientService } from './patient.service';
import { CreatePatientDTO, UpdatePatientDTO } from './patient.types';

class PatientController {
  /**
   * GET /patients/:id
   * Get patient by ID (trusts JWT from gateway)
   */
  async getPatientById(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (!id) {
        return res.status(400).json({ error: 'Patient ID is required' });
      }

      const patient = await patientService.getPatientById(id);

      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }

      return res.status(200).json(patient);
    } catch (error) {
      console.error('Get patient error:', error);
      return res.status(500).json({ error: 'Failed to fetch patient' });
    }
  }

  /**
   * PUT /patients/:id
   * Update patient information
   */
  async updatePatient(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (!id) {
        return res.status(400).json({ error: 'Patient ID is required' });
      }

      const data: UpdatePatientDTO = req.body;

      const patient = await patientService.updatePatient(id, data);

      return res.status(200).json(patient);
    } catch (error) {
      console.error('Update patient error:', error);
      return res.status(500).json({ error: 'Failed to update patient' });
    }
  }

  /**
   * DELETE /patients/:id
   * Soft delete (deactivate) patient
   */
  async deactivatePatient(req: Request, res: Response) {
    try {
      const id = Array.isArray(req.params.id)
        ? req.params.id[0]
        : req.params.id;

      if (!id) {
        return res.status(400).json({ error: 'Patient ID is required' });
      }

      await patientService.deactivatePatient(id);

      return res.status(204).send();
    } catch (error) {
      console.error('Deactivate patient error:', error);
      return res.status(500).json({ error: 'Failed to deactivate patient' });
    }
  }
}

export const patientController = new PatientController();
