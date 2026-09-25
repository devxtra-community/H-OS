import { api } from '@/src/lib/api';

export interface PharmacyAuditItem {
  id: string;
  item_id: string;
  item_name: string;
  category: string;
  quantity: number;
  instructions?: string;
}

export interface PharmacyAuditRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  status: string;
  created_at: string;
  dispensed_at: string;
  doctor_name: string;
  doctor_email?: string;
  items: PharmacyAuditItem[];
}

export interface BedAuditRecord {
  id: string;
  bed_id: string;
  bed_number: string;
  room_number: string;
  ward_name: string;
  patient_id: string;
  patient_name: string;
  doctor_id?: string;
  doctor_name?: string;
  admission_id?: string;
  assigned_at: string;
  discharged_at?: string | null;
  current_bed_status: string;
}

export async function getPharmacyHistory(): Promise<PharmacyAuditRecord[]> {
  const res = await api.get('/prescriptions/history');
  return res.data;
}

export async function getBedHistory(): Promise<BedAuditRecord[]> {
  const res = await api.get('/admin/beds/history');
  return res.data;
}
