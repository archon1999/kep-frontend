import { Component } from '@angular/core';
import { SectionFeaturesComponent } from '@app/modules/landing-page/sections/section-features/section-features.component';
import { SectionHeaderComponent } from '@app/modules/landing-page/sections/section-header/section-header.component';
import { NavbarComponent } from '@app/modules/landing-page/navbar/navbar.component';
import { SectionStatisticsComponent } from '@app/modules/landing-page/sections/section-statistics/section-statistics.component';
import { SectionReviewsComponent } from '@app/modules/landing-page/sections/section-reviews/section-reviews.component';
import { SectionPracticeComponent } from '@app/modules/landing-page/sections/section-practice/section-practice.component';
import { SectionGetStartedComponent } from '@app/modules/landing-page/sections/section-get-started/section-get-started.component';
import { SectionContactUsComponent } from '@app/modules/landing-page/sections/section-contact-us/section-contact-us.component';
import { SectionFaqComponent } from '@app/modules/landing-page/sections/section-faq/section-faq.component';
import { CoreConfigService } from '@core/services/config.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  standalone: true,
  imports: [
    SectionFeaturesComponent,
    SectionHeaderComponent,
    NavbarComponent,
    SectionStatisticsComponent,
    SectionReviewsComponent,
    SectionPracticeComponent,
    SectionGetStartedComponent,
    SectionContactUsComponent,
    SectionFaqComponent,
  ],
})
export class LandingPageComponent {
  constructor(public coreConfigService: CoreConfigService) {
    this.coreConfigService.config = {
      layout: {
        menu: {
          hidden: true
        },
        navbar: {
          hidden: true,
        },
        animation: 'none',
        enableLocalStorage: false
      }
    };
  }
}
