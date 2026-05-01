import { createKeyFactory } from 'shared/api';

const baseHackathonsKeys = createKeyFactory('hackathons');

export const hackathonsKeys = {
  ...baseHackathonsKeys,
  projects: (hackathonId: string | number) => ['hackathons', 'projects', hackathonId] as const,
  project: (hackathonId: string | number, symbol: string) => ['hackathons', 'project', hackathonId, symbol] as const,
  registrants: (hackathonId: string | number) => ['hackathons', 'registrants', hackathonId] as const,
  standings: (hackathonId: string | number) => ['hackathons', 'standings', hackathonId] as const,
  mutation: (scope: string) => ['hackathons', 'mutation', scope] as const,
};
