import { api } from '../../../lib/api';

export const getInventoryItems = async () => {
  const res = await api.get('/staff/inventory/items');
  return res.data;
};

export const addStock = async (data: { itemId: string; quantity: number }) => {
  const res = await api.post('/staff/inventory/stock', data);
  return res.data;
};

export const useItem = async (data: {
  itemId: string;
  quantity: number;
  patientId?: string;
}) => {
  const res = await api.post('/staff/inventory/use', data);
  return res.data;
};

export const createItem = async (data: {
  name: string;
  category: string;
  quantity: number;
}) => {
  const res = await api.post('/staff/inventory/items', data);
  return res.data;
};
