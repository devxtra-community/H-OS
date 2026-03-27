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

  async dischargePatient(admissionId: string) {
    const result = await pool.query(
      `
    SELECT bed_id
    FROM bed_assignments
    WHERE admission_id = $1
    AND discharged_at IS NULL
    `,
      [admissionId]
    );

    const bedId = result.rows[0]?.bed_id;

    if (!bedId) {
      throw new Error('Active bed assignment not found');
    }

    await pool.query(
      `
    UPDATE bed_assignments
    SET discharged_at = now()
    WHERE admission_id = $1
    `,
      [admissionId]
    );

    await pool.query(
      `
    UPDATE beds
    SET status = 'AVAILABLE'
    WHERE id = $1
    `,
      [bedId]
    );

    await fetch(
      `${process.env.PATIENT_SERVICE_URL}/admissions/${admissionId}/discharged`,
      { method: 'POST' }
    );
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
}

export const bedsService = new BedsService();
