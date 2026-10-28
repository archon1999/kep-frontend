import { HttpUserProfileRepository } from './repository/http.user-profile.repository';
import { HttpUsersRepository } from './repository/http.users.repository';

export const repository = new HttpUsersRepository();

export const profileRepository = new HttpUserProfileRepository();
