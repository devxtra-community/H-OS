import { Request, Response } from 'express';
import { inventoryService } from './inventory.service';

export class InventoryController {
  async getItems(req: Request, res: Response) {
    try {
      const items = await inventoryService.getItems();
      res.json(items);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async createItem(req: Request, res: Response) {
    try {
      const staffId = req.headers['x-user-id'] as string;
      const item = await inventoryService.createItem(req.body, staffId);
      res.json(item);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async addStock(req: Request, res: Response) {
    try {
      const staffId = req.headers['x-user-id'] as string;
      const { itemId, quantity } = req.body;
      const item = await inventoryService.addStock(itemId, quantity, staffId);
      res.json(item);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async useItem(req: Request, res: Response) {
    try {
      const staffId = req.headers['x-user-id'] as string;
      const { itemId, quantity, patientId } = req.body;
      const item = await inventoryService.useItem(
        itemId,
        quantity,
        staffId,
        patientId
      );
      res.json(item);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async getTransactions(req: Request, res: Response) {
    try {
      const transactions = await inventoryService.getTransactions();
      res.json(transactions);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
