import useSWR, { type SWRConfiguration } from 'swr';
import type { ApiHackathonsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { hackathonsRepository } from '../data-access';
import type { Hackathon, HackathonProject, HackathonRegistrant, HackathonStanding, PageResult } from '../domain';
import { hackathonsKeys } from './keys';

export const useHackathonsList = (
  params?: ApiHackathonsListParams,
  config?: SWRConfiguration<PageResult<Hackathon>>,
) =>
  useSWR<PageResult<Hackathon>>(
    hackathonsKeys.list(params as Record<string, unknown> | undefined),
    () => hackathonsRepository.list(params),
    {
      suspense: false,
      ...config,
    },
  );

export const useHackathon = (id?: string, config?: SWRConfiguration<Hackathon>) =>
  useSWR<Hackathon>(id ? hackathonsKeys.detail(id) : null, () => hackathonsRepository.getById(id!), {
    suspense: false,
    ...config,
  });

export const useHackathonProjects = (id?: string, config?: SWRConfiguration<HackathonProject[]>) =>
  useSWR<HackathonProject[]>(id ? hackathonsKeys.projects(id) : null, () => hackathonsRepository.getProjects(id!), {
    suspense: false,
    ...config,
  });

export const useHackathonProject = (
  hackathonId?: string,
  symbol?: string,
  config?: SWRConfiguration<HackathonProject>,
) =>
  useSWR<HackathonProject>(
    hackathonId && symbol ? hackathonsKeys.project(hackathonId, symbol) : null,
    () => hackathonsRepository.getProjectBySymbol(hackathonId!, symbol!),
    {
      suspense: false,
      ...config,
    },
  );

export const useHackathonRegistrants = (
  hackathonId?: string,
  config?: SWRConfiguration<HackathonRegistrant[]>,
) =>
  useSWR<HackathonRegistrant[]>(
    hackathonId ? hackathonsKeys.registrants(hackathonId) : null,
    () => hackathonsRepository.getRegistrants(hackathonId!),
    {
      suspense: false,
      refreshInterval: 15000,
      ...config,
    },
  );

export const useHackathonStandings = (
  hackathonId?: string,
  config?: SWRConfiguration<HackathonStanding[]>,
) =>
  useSWR<HackathonStanding[]>(
    hackathonId ? hackathonsKeys.standings(hackathonId) : null,
    () => hackathonsRepository.getStandings(hackathonId!),
    {
      suspense: false,
      refreshInterval: 30000,
      ...config,
    },
  );
