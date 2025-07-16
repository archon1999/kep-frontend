export interface Hackathon {
  id: number;
  name: string;
  slug: string;
  description: string;
  startTime: string | Date;
  endTime: string | Date;
  logo?: string;
  status: number;
  projectsCount: number;
  participantsCount: number;
  registrantsCount: number;
}
