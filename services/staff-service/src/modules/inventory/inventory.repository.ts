import { pool } from '../../db';
import { randomUUID } from 'crypto';

class InventoryRepository {
  async getItems() {
    const result = await pool.query(
      `SELECT * FROM inventory_items ORDER BY name ASC`
    );
    return result.rows;
  }

  async createItem(data: { name: string; category: string; quantity: number }) {
    const result = await pool.query(
      `
      INSERT INTO inventory_items (id, name, category, quantity)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [randomUUID(), data.name, data.category, data.quantity]
    );
    return result.rows[0];
  }

  async adjustQuantity(itemId: string, amount: number) {
    const result = await pool.query(
      `
      UPDATE inventory_items
      SET quantity = quantity + $2
      WHERE id = $1
      RETURNING *
      `,
      [itemId, amount]
    );
    return result.rows[0];
  }

  async logTransaction(data: {
    itemId: string;
    type: 'IN' | 'OUT';
    quantity: number;
    staffId: string;
    patientId?: string;
  }) {
    const result = await pool.query(
      `
      INSERT INTO inventory_transactions (id, item_id, type, quantity, staff_id, patient_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        randomUUID(),
        data.itemId,
        data.type,
        data.quantity,
        data.staffId,
        data.patientId || null,
      ]
    );
    return result.rows[0];
  }

  async getTransactions() {
    const result = await pool.query(
      `
      SELECT t.*, i.name as item_name, s.name as staff_name
      FROM inventory_transactions t
      JOIN inventory_items i ON t.item_id = i.id
      LEFT JOIN staff s ON t.staff_id = s.id
      ORDER BY t.timestamp DESC
      LIMIT 100
      `
    );
    return result.rows;
  }
}

export const inventoryRepository = new InventoryRepository();
