import { HttpProjectAttemptsRepository } from './repository/http.project-attempts.repository.ts';
import { HttpProjectsRepository } from './repository/http.projects.repository.ts';
import { HttpProjectsRatingRepository } from './repository/projects-rating.repository.impl';

export const projectsRepository = new HttpProjectsRepository();

export const attemptsRepository = new HttpProjectAttemptsRepository();

export const projectsRatingRepository = new HttpProjectsRatingRepository();
