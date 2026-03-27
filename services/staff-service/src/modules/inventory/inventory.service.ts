import { inventoryRepository } from './inventory.repository';

class InventoryService {
  async getItems() {
    return inventoryRepository.getItems();
  }

  async createItem(
    data: { name: string; category: string; quantity: number },
    staffId: string
  ) {
    const item = await inventoryRepository.createItem(data);
    if (data.quantity > 0) {
      await inventoryRepository.logTransaction({
        itemId: item.id,
        type: 'IN',
        quantity: data.quantity,
        staffId,
      });
    }
    return item;
  }

  async addStock(itemId: string, quantity: number, staffId: string) {
    if (quantity <= 0) throw new Error('Quantity must be greater than zero');

    const updated = await inventoryRepository.adjustQuantity(itemId, quantity);
    await inventoryRepository.logTransaction({
      itemId,
      type: 'IN',
      quantity,
      staffId,
    });

    return updated;
  }

  async useItem(
    itemId: string,
    quantity: number,
    staffId: string,
    patientId?: string
  ) {
    if (quantity <= 0) throw new Error('Quantity must be greater than zero');

    const items = await inventoryRepository.getItems();
    const item = items.find((i: any) => i.id === itemId);
    if (!item) throw new Error('Item not found');
    if (item.quantity < quantity) throw new Error('Insufficient stock');

    const updated = await inventoryRepository.adjustQuantity(itemId, -quantity);
    await inventoryRepository.logTransaction({
      itemId,
      type: 'OUT',
      quantity,
      staffId,
      patientId,
    });

    return updated;
  }

  async getTransactions() {
    return inventoryRepository.getTransactions();
  }
}

export const inventoryService = new InventoryService();
