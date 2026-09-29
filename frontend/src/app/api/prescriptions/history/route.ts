import { NextResponse } from 'next/server';
import { pool } from '@/src/lib/server/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.patient_id,
        COALESCE(p.patient_name, pat.name, 'Patient') AS patient_name,
        p.status,
        p.created_at,
        p.created_at AS dispensed_at,
        COALESCE(s.name, 'Doctor') AS doctor_name,
        s.email AS doctor_email,
        COALESCE(
          json_agg(
            json_build_object(
              'id', pi.id,
              'item_id', pi.item_id,
              'quantity', pi.quantity,
              'instructions', pi.instructions,
              'item_name', i.name,
              'category', i.category
            )
          ) FILTER (WHERE pi.id IS NOT NULL),
          '[]'::json
        ) AS items
      FROM prescriptions p
      LEFT JOIN patients pat ON p.patient_id = pat.id
      LEFT JOIN staff s ON p.doctor_id = s.id
      LEFT JOIN prescription_items pi ON p.id = pi.prescription_id
      LEFT JOIN inventory_items i ON pi.item_id = i.id
      GROUP BY p.id, p.patient_id, p.patient_name, pat.name, p.status, p.created_at, s.name, s.email
      ORDER BY p.created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Failed to fetch prescription history' },
      { status: 500 }
    );
  }
}
