import { Injectable } from '@angular/core';
import { ApiService } from 'app/shared/services/api.service';
import { AuthService } from '@auth';
import {
  UserEducation,
  UserGeneralInfo,
  UserInfo,
  UserSkills,
  UserSocial,
  UserTechnology,
  UserWorkExperience
} from '@users/users.models';

@Injectable({
  providedIn: 'root'
})
export class AccountSettingsService {
  currentUser = this.authService.currentUserValue;

  constructor(
    public api: ApiService,
    public authService: AuthService,
  ) { }

  getUserGeneralInfo() {
    return this.api.get(`users/${this.currentUser.username}/general-info/`);
  }

  updateUserGeneralInfo(generalInfo: UserGeneralInfo) {
    return this.api.post(`users/${this.currentUser.username}/general-info/`, generalInfo);
  }

  getUserInfo() {
    return this.api.get(`users/${this.currentUser.username}/info`);
  }

  updateUserInfo(info: UserInfo) {
    return this.api.post(`users/${this.currentUser.username}/info/`, info);
  }

  getUserSkills() {
    return this.api.get(`users/${this.currentUser.username}/skills`);
  }

  updateUserSkills(userSkills: UserSkills) {
    return this.api.post(`users/${this.currentUser.username}/skills`, userSkills);
  }

  getUserSocial() {
    return this.api.get(`users/${this.currentUser.username}/social`);
  }

  updateUserSocial(userSocial: UserSocial) {
    return this.api.post(`users/${this.currentUser.username}/social`, userSocial);
  }

  getUserTechnologies() {
    return this.api.get(`users/${this.currentUser.username}/technologies`);
  }

  updateUserTechnologies(userTechnologies: Array<UserTechnology>) {
    return this.api.post(`users/${this.currentUser.username}/technologies`, userTechnologies);
  }

  getUserEducations() {
    return this.api.get(`users/${this.currentUser.username}/educations`);
  }

  updateUserEducations(userEducations: Array<UserEducation>) {
    return this.api.post(`users/${this.currentUser.username}/educations`, userEducations);
  }

  getUserWorkExperiences() {
    return this.api.get(`users/${this.currentUser.username}/work-experiences/`);
  }

  updateUserWorkExperiences(userWorkExperiences: Array<UserWorkExperience>) {
    return this.api.post(`users/${this.currentUser.username}/work-experiences`, userWorkExperiences);
  }

  changePassword(oldPassowrd: string, newPassword: string) {
    const data = {'oldPassword': oldPassowrd, 'newPassword': newPassword};
    return this.api.post(`users/${this.currentUser.username}/change-password/`, data);
  }

  getUserTeams() {
    return this.api.get(`user-teams/`);
  }

  createTeam(name: string) {
    return this.api.post('user-teams', {name});
  }

  joinTeam(teamCode: string) {
    return this.api.post(`user-teams/${teamCode}/join/`);
  }

  refreshTeamCode(teamCode: string) {
    return this.api.post(`user-teams/${teamCode}/refresh-code/`);
  }
}
