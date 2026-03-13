import useSWR from 'swr';
import { ApiHackathonsListParams } from 'shared/api/orval/generated/endpoints/index.schemas';
import { HttpHackathonsRepository } from '../data-access/repository/http.hackathons.repository';
import { Hackathon } from '../domain/entities/hackathon.entity';
import { HackathonProject, HackathonRegistrant, HackathonStanding } from '../domain/entities/hackathon-project.entity';
import { PageResult } from '../domain/ports/hackathons.repository';

const hackathonsRepository = new HttpHackathonsRepository();

export const useHackathonsList = (params?: ApiHackathonsListParams) =>
  useSWR<PageResult<Hackathon>>(['hackathons-list', params?.page, params?.pageSize], () => hackathonsRepository.list(params), {
    suspense: false,
  });

export const useHackathon = (id?: string) =>
  useSWR<Hackathon>(id ? ['hackathon', id] : null, () => hackathonsRepository.getById(id!), { suspense: false });

export const useHackathonProjects = (id?: string) =>
  useSWR<HackathonProject[]>(id ? ['hackathon-projects', id] : null, () => hackathonsRepository.getProjects(id!), {
    suspense: false,
  });

export const useHackathonProject = (hackathonId?: string, symbol?: string) =>
  useSWR<HackathonProject | null>(
    hackathonId && symbol ? ['hackathon-project', hackathonId, symbol] : null,
    () => hackathonsRepository.getProjectBySymbol(hackathonId!, symbol!),
    { suspense: false },
  );

export const useHackathonRegistrants = (hackathonId?: string) =>
  useSWR<HackathonRegistrant[]>(
    hackathonId ? ['hackathon-registrants', hackathonId] : null,
    () => hackathonsRepository.getRegistrants(hackathonId!),
    { suspense: false, refreshInterval: 15000 },
  );

export const useHackathonStandings = (hackathonId?: string) =>
  useSWR<HackathonStanding[]>(
    hackathonId ? ['hackathon-standings', hackathonId] : null,
    () => hackathonsRepository.getStandings(hackathonId!),
    { suspense: false, refreshInterval: 30000 },
  );

export const hackathonsQueries = {
  hackathonsRepository,
};
