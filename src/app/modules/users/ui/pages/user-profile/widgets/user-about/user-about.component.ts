import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  UserEducation,
  UserInfo,
  UsersApiService,
  UserSkills,
  UserTechnology,
  UserWorkExperience
} from "@app/modules/users";
import { forkJoin, Observable } from "rxjs";
import { BaseLoadComponent } from "@core/common";
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { TranslatePipe } from "@ngx-translate/core";
import { NgbProgressbar } from "@ng-bootstrap/ng-bootstrap";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";

type UserAbout = {
  userInfo: UserInfo;
  userEducations: UserEducation[],
  userWorkExperiences: UserWorkExperience[],
  userSkills: UserSkills;
  userTechnologies: UserTechnology[],
}

@Component({
  selector: 'user-about',
  standalone: true,
  imports: [
    CommonModule,
    KepCardComponent,
    TranslatePipe,
    NgbProgressbar,
    NgxSkeletonLoaderModule,
  ],
  templateUrl: './user-about.component.html',
  styleUrl: './user-about.component.scss'
})
export class UserAboutComponent extends BaseLoadComponent<UserAbout> {
  @Input({required: true}) username: string;

  private readonly usersService = inject(UsersApiService);

  getData(): Observable<UserAbout> {
    return forkJoin({
      userInfo: this.usersService.getUserInfo(this.username),
      userEducations: this.usersService.getUserEducations(this.username),
      userWorkExperiences: this.usersService.getUserWorkExperiences(this.username),
      userSkills: this.usersService.getUserSkills(this.username),
      userTechnologies: this.usersService.getUserTechnologies(this.username),
    });
  }
}
