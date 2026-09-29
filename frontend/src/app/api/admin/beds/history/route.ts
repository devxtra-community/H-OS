import { NextResponse } from 'next/server';
import { pool } from '@/src/lib/server/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        ba.id,
        ba.bed_id,
        ba.patient_id,
        COALESCE(p.name, 'Unknown Patient') AS patient_name,
        ba.admission_id,
        adm.doctor_id,
        COALESCE(s.name, 'Doctor') AS doctor_name,
        ba.assigned_at,
        ba.discharged_at,
        b.bed_number,
        b.status AS current_bed_status,
        r.room_number,
        w.name AS ward_name
      FROM bed_assignments ba
      LEFT JOIN beds b ON ba.bed_id = b.id
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN wards w ON r.ward_id = w.id
      LEFT JOIN patients p ON ba.patient_id = p.id
      LEFT JOIN admissions adm ON ba.admission_id = adm.id
      LEFT JOIN staff s ON adm.doctor_id = s.id
      ORDER BY ba.assigned_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch bed history' },
      { status: 500 }
    );
  }
}
