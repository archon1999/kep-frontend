import { ProjectTask } from '@app/modules/projects/interfaces/project-task';
import { ProjectAvailableTechnology } from '@app/modules/projects/interfaces/project-available-technology';

export interface Project {
  id: number;
  title: string;
  slug: string;
  kepcoins: number;
  descriptionShort: string;
  description: string;
  tasks: Array<ProjectTask>;
  availableTechnologies: Array<ProjectAvailableTechnology>;
  level: number;
  levelTitle: string;
  tags: Array<any>;
  inThePipeline: boolean;
  purchaseKepcoinValue: number;
  logo: string;
  purchased: boolean;
}
