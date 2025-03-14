import { Component } from '@angular/core';
import { WorkExperiencesComponent } from '@app/modules/account-settings/career/work-experiences/work-experiences.component';
import { EducationsComponent } from '@app/modules/account-settings/career/educations/educations.component';

@Component({
  selector: 'career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss'],
  standalone: true,
  imports: [
    WorkExperiencesComponent,
    EducationsComponent
  ]
})
export class CareerComponent {}
