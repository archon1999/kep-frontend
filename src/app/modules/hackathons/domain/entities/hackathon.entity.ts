export interface Hackathon {
  id: number;
  title: string;
  slug: string;
  description: string;
  startTime: string | Date;
  finishTime: string | Date;
  logo: string | null;
  status: number;
  projectsCount: number;
  participantsCount: number;
  registrantsCount: number;
  isRegistered: boolean;
  isParticipated: boolean;
}
