export interface ProjectTaskDto {
  number: number;
  title: string;
  description: string;
  kepcoinValue: number;
}

export interface ProjectAvailableTechnologyDto {
  technology: string;
  info: string;
}

export interface ProjectDto {
  id: number;
  title: string;
  slug: string;
  kepcoins: number;
  descriptionShort: string;
  description: string;
  tasks: ProjectTaskDto[];
  availableTechnologies: ProjectAvailableTechnologyDto[];
  level: number;
  levelTitle: string;
  tags: any[];
  inThePipeline: boolean;
  purchaseKepcoinValue: number;
  logo: string;
  purchased: boolean;
} 