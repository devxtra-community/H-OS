import { pool } from '../db';
import { randomUUID } from 'crypto';

export class InventoryService {
  async getItems() {
    const result = await pool.query(
      `SELECT * FROM inventory_items ORDER BY name ASC`
    );
    return result.rows;
  }

  async createItem(
    data: { name: string; category: string; quantity: number },
    staffId: string
  ) {
    const result = await pool.query(
      `INSERT INTO inventory_items (id, name, category, quantity) VALUES ($1, $2, $3, $4) RETURNING *`,
      [randomUUID(), data.name, data.category, data.quantity]
    );
    const item = result.rows[0];

    if (data.quantity > 0) {
      await pool.query(
        `INSERT INTO inventory_transactions (id, item_id, type, quantity, staff_id) VALUES ($1, $2, 'IN', $3, $4)`,
        [randomUUID(), item.id, data.quantity, staffId]
      );
    }
    return item;
  }

  async addStock(itemId: string, quantity: number, staffId: string) {
    if (quantity <= 0) throw new Error('Quantity must be greater than zero');
    const result = await pool.query(
      `UPDATE inventory_items SET quantity = quantity + $2 WHERE id = $1 RETURNING *`,
      [itemId, quantity]
    );
    await pool.query(
      `INSERT INTO inventory_transactions (id, item_id, type, quantity, staff_id) VALUES ($1, $2, 'IN', $3, $4)`,
      [randomUUID(), itemId, quantity, staffId]
    );
    return result.rows[0];
  }

  async useItem(
    itemId: string,
    quantity: number,
    staffId: string,
    patientId?: string
  ) {
    if (quantity <= 0) throw new Error('Quantity must be greater than zero');
    const items = await this.getItems();
    const item = items.find((i: any) => i.id === itemId);
    if (!item) throw new Error('Item not found');
    if (item.quantity < quantity) throw new Error('Insufficient stock');

    const result = await pool.query(
      `UPDATE inventory_items SET quantity = quantity - $2 WHERE id = $1 RETURNING *`,
      [itemId, quantity]
    );
    await pool.query(
      `INSERT INTO inventory_transactions (id, item_id, type, quantity, staff_id, patient_id) VALUES ($1, $2, 'OUT', $3, $4, $5)`,
      [randomUUID(), itemId, quantity, staffId, patientId || null]
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

export const inventoryService = new InventoryService();
