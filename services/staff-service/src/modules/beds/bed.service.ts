import { pool } from '../../db';
import { randomUUID } from 'crypto';

class BedsService {
  async createWard(name: string, description?: string) {
    const result = await pool.query(
      `
      INSERT INTO wards (id, name, description)
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [randomUUID(), name, description]
    );

    return result.rows[0];
  }

  async createRoom(wardId: string, roomNumber: string) {
    const result = await pool.query(
      `
      INSERT INTO rooms (id, ward_id, room_number)
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [randomUUID(), wardId, roomNumber]
    );

    return result.rows[0];
  }

  async createBed(roomId: string, bedNumber: string) {
    const result = await pool.query(
      `
      INSERT INTO beds (id, room_id, bed_number)
      VALUES ($1,$2,$3)
      RETURNING *
      `,
      [randomUUID(), roomId, bedNumber]
    );

    return result.rows[0];
  }

  async getBeds() {
    const result = await pool.query(
      `
      SELECT
        b.id,
        b.bed_number,
        b.status,
        r.room_number,
        w.name AS ward,
        ba.patient_id
      FROM beds b
      JOIN rooms r ON b.room_id = r.id
      JOIN wards w ON r.ward_id = w.id
      LEFT JOIN bed_assignments ba ON b.id = ba.bed_id AND ba.discharged_at IS NULL
      `
    );

    const beds = result.rows;
    const activePatientIds = beds
      .filter((b) => b.status === 'OCCUPIED' && b.patient_id)
      .map((b) => b.patient_id);

    if (activePatientIds.length === 0) return beds;

    try {
      // 1. Fetch names and current admissions from patient-service
      const [patientsRes, admissionsRes] = await Promise.all([
        fetch(`${process.env.PATIENT_SERVICE_URL}/patients/bulk-info`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: activePatientIds }),
        }),
        fetch(`${process.env.PATIENT_SERVICE_URL}/admissions/bulk-current`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ patientIds: activePatientIds }),
        }),
      ]);

      if (!patientsRes.ok || !admissionsRes.ok) {
        throw new Error('Failed to fetch patient or admission info');
      }

      const patientsData = await patientsRes.json();
      const admissionsData = await admissionsRes.json();

      const patientMap = new Map(patientsData.map((p: any) => [p.id, p.name]));
      const admissionMap = new Map(
        admissionsData.map((a: any) => [a.patient_id, a.doctor_id])
      );

      const doctorIds = Array.from(
        new Set(admissionsData.map((a: any) => a.doctor_id)) as Set<string>
      );

      // 2. Fetch doctor names from local staff table
      let doctorMap = new Map();
      if (doctorIds.length > 0) {
        const staffRes = await pool.query(
          `SELECT id, name FROM staff WHERE id = ANY($1::uuid[])`,
          [doctorIds]
        );
        doctorMap = new Map(staffRes.rows.map((s: any) => [s.id, s.name]));
      }

      // 3. Map back to beds
      return beds.map((bed) => {
        if (bed.status === 'OCCUPIED' && bed.patient_id) {
          const doctorId = admissionMap.get(bed.patient_id);
          return {
            ...bed,
            patient_name: patientMap.get(bed.patient_id) || 'Unknown Patient',
            doctor_name: doctorId
              ? doctorMap.get(doctorId) || 'Unknown Doctor'
              : 'Unknown Doctor',
          };
        }
        return bed;
      });
    } catch (e) {
      console.error('Enrichment failed:', e);
      return beds;
    }
  }

  async assignBed(bedId: string, patientId: string, admissionId: string) {
    const check = await pool.query(`SELECT status FROM beds WHERE id = $1`, [
      bedId,
    ]);

    if (check.rows[0]?.status !== 'AVAILABLE') {
      throw new Error('Bed not available');
    }

    // Mark bed occupied
    await pool.query(`UPDATE beds SET status = 'OCCUPIED' WHERE id = $1`, [
      bedId,
    ]);

    // Create assignment
    const assignment = await pool.query(
      `
    INSERT INTO bed_assignments (id, bed_id, patient_id, admission_id)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
      [randomUUID(), bedId, patientId, admissionId]
    );

    // 🔁 Notify patient-service admission is complete
    await fetch(
      `${process.env.PATIENT_SERVICE_URL}/admissions/${admissionId}/admit`,
      { method: 'POST' }
    );

    return assignment.rows[0];
  }

  async dischargePatient(
    input: string | { admissionId?: string; bedId?: string }
  ) {
    const admissionId = typeof input === 'string' ? input : input.admissionId;
    const directBedId = typeof input === 'object' ? input.bedId : undefined;

    let result;
    if (admissionId) {
      result = await pool.query(
        `
        SELECT id, bed_id, admission_id
        FROM bed_assignments
        WHERE admission_id = $1
        AND discharged_at IS NULL
        `,
        [admissionId]
      );
    } else if (directBedId) {
      result = await pool.query(
        `
        SELECT id, bed_id, admission_id
        FROM bed_assignments
        WHERE bed_id = $1
        AND discharged_at IS NULL
        `,
        [directBedId]
      );
    }

    const assignment = result?.rows[0];
    const targetBedId = assignment?.bed_id || directBedId;
    const targetAdmissionId = assignment?.admission_id || admissionId;

    if (!targetBedId) {
      throw new Error('Active bed assignment not found');
    }

    if (assignment) {
      await pool.query(
        `
        UPDATE bed_assignments
        SET discharged_at = now()
        WHERE id = $1
        `,
        [assignment.id]
      );
    }

    await pool.query(
      `
      UPDATE beds
      SET status = 'AVAILABLE'
      WHERE id = $1
      `,
      [targetBedId]
    );

    if (targetAdmissionId) {
      try {
        await fetch(
          `${process.env.PATIENT_SERVICE_URL}/admissions/${targetAdmissionId}/discharged`,
          { method: 'POST' }
        );
      } catch (err: any) {
        console.error(
          'Failed to notify patient-service of discharge:',
          err.message
        );
      }
    }
  }

  async getActiveAssignments(patientIds: string[]) {
    if (!patientIds || patientIds.length === 0) return [];

    const result = await pool.query(
      `
      SELECT 
        ba.patient_id,
        b.bed_number,
        r.room_number,
        w.name AS ward
      FROM bed_assignments ba
      JOIN beds b ON ba.bed_id = b.id
      JOIN rooms r ON b.room_id = r.id
      JOIN wards w ON r.ward_id = w.id
      WHERE ba.patient_id = ANY($1::uuid[])
      AND ba.discharged_at IS NULL
      `,
      [patientIds]
    );

    return result.rows;
  }

  async getWards() {
    const result = await pool.query(`
    SELECT id, name
    FROM wards
    ORDER BY name
  `);

    return result.rows;
  }

  async getRoomsByWard(wardId: string) {
    const result = await pool.query(
      `
    SELECT id, room_number
    FROM rooms
    WHERE ward_id = $1
    ORDER BY room_number
  `,
      [wardId]
    );

    return result.rows;
  }
  async getBedsByRoom(roomId: string) {
    const result = await pool.query(
      `
    SELECT id, bed_number, status
    FROM beds
    WHERE room_id = $1
    AND status = 'AVAILABLE'
    ORDER BY bed_number
    `,
      [roomId]
    );

    return result.rows;
  }

  async getBedHistory() {
    const result = await pool.query(
      `
      SELECT
        ba.id,
        ba.bed_id,
        ba.patient_id,
        ba.admission_id,
        ba.assigned_at,
        ba.discharged_at,
        b.bed_number,
        b.status AS current_bed_status,
        r.room_number,
        w.name AS ward_name
      FROM bed_assignments ba
      JOIN beds b ON ba.bed_id = b.id
      JOIN rooms r ON b.room_id = r.id
      JOIN wards w ON r.ward_id = w.id
      ORDER BY ba.assigned_at DESC
      `
    );

    const assignments = result.rows;
    if (assignments.length === 0) return [];

    const patientIds = Array.from(
      new Set(assignments.map((a) => a.patient_id).filter(Boolean))
    );
    const admissionIds = Array.from(
      new Set(assignments.map((a) => a.admission_id).filter(Boolean))
    );

    let patientMap = new Map<string, string>();
    let admissionDoctorMap = new Map<string, string>();
    let doctorMap = new Map<string, string>();

    try {
      const promises: Promise<any>[] = [];

      // 1. Fetch patient names from patient-service
      if (patientIds.length > 0) {
        promises.push(
          fetch(`${process.env.PATIENT_SERVICE_URL}/patients/bulk-info`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: patientIds }),
          })
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
              if (Array.isArray(data)) {
                patientMap = new Map(data.map((p: any) => [p.id, p.name]));
              }
            })
            .catch(() => {})
        );
      }

      // 2. Fetch admission records (for doctor_id) from patient-service
      if (admissionIds.length > 0 || patientIds.length > 0) {
        promises.push(
          fetch(`${process.env.PATIENT_SERVICE_URL}/admissions/bulk-info`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ admissionIds, patientIds }),
          })
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
              if (Array.isArray(data)) {
                for (const adm of data) {
                  if (adm.id && adm.doctor_id) {
                    admissionDoctorMap.set(adm.id, adm.doctor_id);
                  }
                  if (adm.patient_id && adm.doctor_id) {
                    admissionDoctorMap.set(adm.patient_id, adm.doctor_id);
                  }
                }
              }
            })
            .catch(() => {})
        );
      }

      await Promise.all(promises);

      // 3. Fetch doctor names from local staff table
      const doctorIds = Array.from(
        new Set(Array.from(admissionDoctorMap.values()).filter(Boolean))
      );
      if (doctorIds.length > 0) {
        const staffRes = await pool.query(
          `SELECT id, name FROM staff WHERE id = ANY($1::uuid[])`,
          [doctorIds]
        );
        doctorMap = new Map(staffRes.rows.map((s: any) => [s.id, s.name]));
      }
    } catch (e) {
      console.error('Failed to enrich bed history:', e);
    }

    return assignments.map((a) => {
      const doctorId =
        (a.admission_id ? admissionDoctorMap.get(a.admission_id) : null) ||
        (a.patient_id ? admissionDoctorMap.get(a.patient_id) : null);

      return {
        ...a,
        patient_name: patientMap.get(a.patient_id) || 'Unknown Patient',
        doctor_id: doctorId || null,
        doctor_name: doctorId
          ? doctorMap.get(doctorId) || 'Attending Physician'
          : 'Attending Physician',
      };
    });
  }
}

export const bedsService = new BedsService();
