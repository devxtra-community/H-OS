import { useQuery } from '@tanstack/react-query';
import { getInventoryItems } from '../api/inventory.api';

export function useInventory() {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: getInventoryItems,
  });
}
