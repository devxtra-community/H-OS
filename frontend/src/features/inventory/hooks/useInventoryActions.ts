import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addStock, useItem, createItem } from '../api/inventory.api';

export function useAddStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addStock,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useConsumeItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: useItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
