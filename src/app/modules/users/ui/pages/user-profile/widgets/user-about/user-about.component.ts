import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfoComponent } from '../user-info/user-info.component';
import { UserSkillsComponent } from '../user-skills/user-skills.component';
import { UserTechnologiesComponent } from '../user-technologies/user-technologies.component';
import { UserEducationsComponent } from '../user-educations/user-educations.component';
import { UserWorkExperiencesComponent } from '../user-work-experiences/user-work-experiences.component';
import { UserSocialComponent } from '../user-social/user-social.component';
import { UserFollowersPreviewComponent } from '../user-followers-preview/user-followers-preview.component';

@Component({
  selector: 'user-about',
  standalone: true,
  imports: [
    CommonModule,
    UserInfoComponent,
    UserSkillsComponent,
    UserTechnologiesComponent,
    UserEducationsComponent,
    UserWorkExperiencesComponent,
    UserSocialComponent,
    UserFollowersPreviewComponent,
  ],
  templateUrl: './user-about.component.html',
  styleUrl: './user-about.component.scss'
})
export class UserAboutComponent {
}
