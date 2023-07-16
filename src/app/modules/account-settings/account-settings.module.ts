import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { CoreDirectivesModule } from '@core/directives/directives';
import { CorePipesModule } from '@core/pipes/pipes.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthGuard } from 'app/auth/helpers';
import { ContentHeaderModule } from 'app/layout/components/content-header/content-header.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { UserPopoverModule } from '../../shared/components/user-popover/user-popover.module';
import { UsersSelectModule } from '../../shared/components/users-select/users-select.module';
import { KepcoinSpendSwalModule } from '../kepcoin/kepcoin-spend-swal/kepcoin-spend-swal.module';
import { NgSelectModule } from '../../shared/third-part-modules/ng-select/ng-select.module';
import { Ng2FlatpickrModule } from '../../shared/third-part-modules/ng2-flatpickr/ng2-flatpickr.module';
import { NouisliderModule } from '../../shared/third-part-modules/nouislider/nouislider.module';
import { QuillModule } from '../../shared/third-part-modules/quill/quill.module';
import { ToastrModule } from '../../shared/third-part-modules/toastr/toastr.module';
import { AccountSettingsComponent } from './account-settings.component';
import { GeneralInfoResolver, UserEducationsResolver, UserInfoResolver, UserSkillsResolver, UserSocialResolver, UserTeamsResolver, UserTechnologiesResolver, UserWorkExperiencesResolver } from './account-settings.resolver';
import { CareerComponent } from './career/career.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { InformationComponent } from './information/information.component';
import { SkillsComponent } from './skills/skills.component';
import { SocialComponent } from './social/social.component';
import { TeamsComponent } from './teams/teams.component';

const routes: Routes = [
  {
    path: '',
    component: AccountSettingsComponent,
    canActivate: [AuthGuard],
    data: {
      animation: 'account-settings'
    },
    resolve: {
      generalInfo: GeneralInfoResolver,
      userInfo: UserInfoResolver,
      userSocial: UserSocialResolver,
      userSkills: UserSkillsResolver,
      userTechnologies: UserTechnologiesResolver,
      userEducations: UserEducationsResolver,
      userWorkExperiences: UserWorkExperiencesResolver,
      userTeams: UserTeamsResolver,
    },
    title: 'Users.AccountSettings',
  }
];

@NgModule({
  declarations: [
    AccountSettingsComponent,
    GeneralSettingsComponent,
    ChangePasswordComponent,
    InformationComponent,
    SocialComponent,
    SkillsComponent,
    CareerComponent,
    TeamsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ContentHeaderModule,
    CoreDirectivesModule,
    CorePipesModule,
    NgbNavModule,
    FormsModule,
    ToastrModule,
    QuillModule,
    Ng2FlatpickrModule,
    NouisliderModule,
    ColorPickerModule,
    NgSelectModule,
    UserPopoverModule,
    UsersSelectModule,
    KepcoinSpendSwalModule,
  ],
  providers: [
    GeneralInfoResolver,
    UserEducationsResolver,
    UserInfoResolver,
    UserSkillsResolver,
    UserSocialResolver,
    UserTeamsResolver,
    UserTechnologiesResolver,
    UserWorkExperiencesResolver
  ]
})
export class AccountSettingsModule { }
