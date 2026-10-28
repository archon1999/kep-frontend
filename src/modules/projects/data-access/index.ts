import { HttpProjectAttemptsRepository } from './repository/http.project-attempts.repository.ts';
import { HttpProjectsRepository } from './repository/http.projects.repository.ts';

export const projectsRepository = new HttpProjectsRepository();

export const attemptsRepository = new HttpProjectAttemptsRepository();
