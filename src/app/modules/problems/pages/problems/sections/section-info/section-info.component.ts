import { Component, OnInit } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'section-info',
  templateUrl: './section-info.component.html',
  styleUrls: ['./section-info.component.scss'],
  animations: [
    fadeInUpOnEnterAnimation(),
    fadeInLeftOnEnterAnimation(),
    fadeInRightOnEnterAnimation(),
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
  ]
})
export class SectionInfoComponent {}
