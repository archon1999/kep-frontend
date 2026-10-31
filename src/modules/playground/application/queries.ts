import useSWR from 'swr';
import { playgroundRepository } from '../data-access';
import { playgroundKeys } from './keys';

export const getRunResult = playgroundRepository.result;
export const useRunnerLanguages = () =>
  useSWR(playgroundKeys.languages, playgroundRepository.languages, {
    revalidateOnFocus: false,
  });
