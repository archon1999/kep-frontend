export enum HackathonStatus {
  NOT_STARTED = -1,
  ALREADY = 0,
  FINISHED = 1,
}

export interface Hackathon {
  id: number;
  title: string;
  slug: string;
  description?: string;
  startTime?: string;
  finishTime?: string;
  logo?: string | null;
  status?: number;
  projectsCount?: number;
  participantsCount?: number;
  registrantsCount?: number;
  isRegistered?: boolean;
  isParticipated?: boolean;
}
