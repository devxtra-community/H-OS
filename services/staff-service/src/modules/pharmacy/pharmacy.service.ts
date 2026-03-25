import { pharmacyRepository } from './pharmacy.repository';
import { inventoryService } from '../inventory/inventory.service';

class PharmacyService {
  async createPrescription(data: {
    patientId: string;
    patientName: string;
    doctorId: string;
    items: { itemId: string; quantity: number; instructions?: string }[];
  }) {
    if (!data.items || data.items.length === 0)
      throw new Error('Prescription must have at least one item');
    return pharmacyRepository.createPrescription(data);
  }

  async getPendingPrescriptions() {
    const prescriptions = await pharmacyRepository.getPendingPrescriptions();
    // Clean up any NULL entries from the aggregations if LEFT JOIN had no matches
    return prescriptions.map((p: any) => ({
      ...p,
      items: p.items.filter((item: any) => item.id !== null),
    }));
  }

  async dispense(prescriptionId: string, staffId: string) {
    // 1. Validate the items
    const items = await pharmacyRepository.getPrescriptionItems(prescriptionId);
    if (!items.length) throw new Error('No items found on this prescription');

    // We need patient mapping info, let's grab it directly
    const pendingList = await pharmacyRepository.getPendingPrescriptions();
    const prescription = pendingList.find((p: any) => p.id === prescriptionId);
    if (!prescription)
      throw new Error('Prescription not found or already dispensed');

    // 2. Iterate and useItem (this seamlessly checks constraints & reduces stock)
    for (const item of items) {
      await inventoryService.useItem(
        item.item_id,
        item.quantity,
        staffId,
        prescription.patient_id
      );
    }

    // 3. Complete fulfillment
    return pharmacyRepository.markDispensed(prescriptionId);
  }
}
export const pharmacyService = new PharmacyService();
