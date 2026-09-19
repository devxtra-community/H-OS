import { pool } from '../db';
import { randomUUID } from 'crypto';
import { inventoryService } from './inventory.service';

export class PharmacyService {
  async createPrescription(data: {
    patientId: string;
    patientName: string;
    doctorId: string;
    items: { itemId: string; quantity: number; instructions?: string }[];
  }) {
    if (!data.items || data.items.length === 0) {
      throw new Error('Prescription must have at least one item');
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const prescriptionId = randomUUID();

      const pRes = await client.query(
        `INSERT INTO prescriptions (id, patient_id, patient_name, doctor_id, status)
         VALUES ($1, $2, $3, $4, 'PENDING') RETURNING *`,
        [prescriptionId, data.patientId, data.patientName, data.doctorId]
      );

      for (const item of data.items) {
        await client.query(
          `INSERT INTO prescription_items (id, prescription_id, item_id, quantity, instructions)
           VALUES ($1, $2, $3, $4, $5)`,
          [
            randomUUID(),
            prescriptionId,
            item.itemId,
            item.quantity,
            item.instructions || '',
          ]
        );
      }

      await client.query('COMMIT');
      return pRes.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async getPendingPrescriptions() {
    const result = await pool.query(
      `
      SELECT 
        p.id, p.patient_id, p.patient_name, p.status, p.created_at,
        s.name as doctor_name,
        json_agg(json_build_object(
          'id', pi.id,
          'item_id', pi.item_id,
          'quantity', pi.quantity,
          'instructions', pi.instructions,
          'item_name', i.name,
          'category', i.category,
          'stock_available', COALESCE(i.quantity, 0)
        )) as items
      FROM prescriptions p
      LEFT JOIN staff s ON p.doctor_id = s.id
      LEFT JOIN prescription_items pi ON p.id = pi.prescription_id
      LEFT JOIN inventory_items i ON pi.item_id = i.id
      WHERE p.status = 'PENDING'
      GROUP BY p.id, s.name
      ORDER BY p.created_at ASC
      `
    );

    return result.rows.map((p: any) => ({
      ...p,
      items: (p.items || []).filter((item: any) => item.id !== null),
    }));
  }

  async dispense(prescriptionId: string, staffId: string) {
    const itemsRes = await pool.query(
      `SELECT * FROM prescription_items WHERE prescription_id = $1`,
      [prescriptionId]
    );
    const items = itemsRes.rows;
    if (!items.length) throw new Error('No items found on this prescription');

    const pendingList = await this.getPendingPrescriptions();
    const prescription = pendingList.find((p: any) => p.id === prescriptionId);
    if (!prescription)
      throw new Error('Prescription not found or already dispensed');

    for (const item of items) {
      await inventoryService.useItem(
        item.item_id,
        item.quantity,
        staffId,
        prescription.patient_id
      );
    }

    const updated = await pool.query(
      `UPDATE prescriptions SET status = 'DISPENSED' WHERE id = $1 RETURNING *`,
      [prescriptionId]
    );
    return updated.rows[0];
  }

  async getPatientPrescriptions(patientId: string) {
    const result = await pool.query(
      `
      SELECT 
        p.id, p.patient_id, p.patient_name, p.status, p.created_at,
        s.name as doctor_name,
        json_agg(json_build_object(
          'id', pi.id,
          'item_id', pi.item_id,
          'quantity', pi.quantity,
          'instructions', pi.instructions,
          'item_name', i.name,
          'category', i.category,
          'stock_available', COALESCE(i.quantity, 0)
        )) as items
      FROM prescriptions p
      LEFT JOIN staff s ON p.doctor_id = s.id
      LEFT JOIN prescription_items pi ON p.id = pi.prescription_id
      LEFT JOIN inventory_items i ON pi.item_id = i.id
      WHERE p.patient_id = $1
      GROUP BY p.id, s.name
      ORDER BY p.created_at DESC
      `,
      [patientId]
    );

    return result.rows.map((p: any) => ({
      ...p,
      items: (p.items || []).filter((item: any) => item.id !== null),
    }));
  }
}

export const pharmacyService = new PharmacyService();
