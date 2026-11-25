import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import useSWR from 'swr';
import { integrityRepository } from '../data-access/repository/integrity.repository.impl';
import type { RunStatus } from '../domain/entities/integrity.types';

export const isScanning = (status?: RunStatus) => status === 'queued' || status === 'running';
function useJuryScope() {
  const { currentUser } = useAuth();
  const { i18n } = useTranslation();
  return currentUser?.isSuperuser ? [currentUser.id, i18n.language] : null;
}
export function useIntegrityContests(q: string) {
  const scope = useJuryScope();
  return useSWR(scope ? ['jury-contests', scope, q] : null, () => integrityRepository.contests(q));
}
export function useContestReview(contest: number, run?: number) {
  const scope = useJuryScope();
  return useSWR(
    scope && contest ? ['jury-review', scope, contest, run] : null,
    () => integrityRepository.review(contest, run),
    { refreshInterval: (data) => (isScanning(data?.runs[0]?.status) ? 3000 : 0) },
  );
}
export function usePairReview(contest: number, pair: number, item: number) {
  const scope = useJuryScope();
  return useSWR(
    scope && pair ? ['jury-pair', scope, contest, pair, item] : null,
    () => integrityRepository.pair(contest, pair, item),
    { revalidateOnFocus: false },
  );
}
export const startIntegrityRun = integrityRepository.start;
export const savePairDecision = integrityRepository.decide;
export const moderateContestant = integrityRepository.moderate;
