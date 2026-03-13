import { Request, Response } from 'express';
import { admissionRepository } from './admission.repository';
import { admissionService } from './admission.service';

export class AdmissionController {
  async requestAdmission(req: Request, res: Response) {
    const { patientId, doctorId, departmentId } = req.body;

    const admission = await admissionRepository.createAdmission({
      patientId,
      doctorId,
      departmentId,
    });

    res.json({
      message: 'Admission requested',
      admission,
    });
  }

  async getPending(req: Request, res: Response) {
    const admissions = await admissionRepository.getPendingAdmissions();

    res.json(admissions);
  }

  async admitPatient(req: Request, res: Response) {
    const admissionId = req.params.id as string;

    await admissionService.admitPatient(admissionId);

    res.json({
      message: 'Patient admitted',
    });
  }

  async requestDischarge(req: Request, res: Response) {
    const admissionId = req.params.id as string;

    await admissionService.requestDischarge(admissionId);

    res.json({
      message: 'Discharge requested',
    });
  }

  async completeDischarge(req: Request, res: Response) {
    const admissionId = req.params.id as string;

    await admissionService.completeDischarge(admissionId);

    res.json({
      message: 'Patient discharged',
    });
  }
  async getDoctorAdmissions(req: Request, res: Response) {
    const doctorId = req.headers['x-user-id'] as string;

    if (!doctorId) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    const admissions = await admissionService.getDoctorAdmissions(doctorId);

    res.json(admissions);
  }
  async getDischargeRequests(req: Request, res: Response) {
    const requests = await admissionService.getDischargeRequests();

    res.json(requests);
  }
}
