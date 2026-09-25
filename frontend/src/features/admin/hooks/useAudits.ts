import { useQuery } from '@tanstack/react-query';
import {
  getPharmacyHistory,
  getBedHistory,
  PharmacyAuditRecord,
  BedAuditRecord,
} from '../api/audits.api';

export function usePharmacyHistory() {
  return useQuery<PharmacyAuditRecord[]>({
    queryKey: ['audits', 'pharmacy'],
    queryFn: getPharmacyHistory,
  });
}

export function useBedHistory() {
  return useQuery<BedAuditRecord[]>({
    queryKey: ['audits', 'beds'],
    queryFn: getBedHistory,
  });
}
