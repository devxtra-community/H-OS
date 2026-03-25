import { api } from '../../../lib/api';

export const createPrescription = async (data: {
  patientId: string;
  patientName: string;
  items: { itemId: string; quantity: number; instructions?: string }[];
}) => {
  const res = await api.post('/staff/pharmacy', data);
  return res.data;
};

export const getPendingPrescriptions = async () => {
  const res = await api.get('/staff/pharmacy/pending');
  return res.data;
};

export const dispensePrescription = async (prescriptionId: string) => {
  const res = await api.post(`/staff/pharmacy/${prescriptionId}/dispense`);
  return res.data;
};
