import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'section-features',
  standalone: true,
  imports: [CoreCommonModule, KepCardComponent],
  templateUrl: './section-features.component.html',
  styleUrl: './section-features.component.scss'
})
export class SectionFeaturesComponent {
  public features = [
    {
      title: 'LandingPage.Features.0.title',
      description: 'LandingPage.Features.0.description',
      icon: 'learn',
    },
    {
      title: 'LandingPage.Features.1.title',
      description: 'LandingPage.Features.1.description',
      icon: 'problems',
    },
    {
      title: 'LandingPage.Features.2.title',
      description: 'LandingPage.Features.2.description',
      icon: 'practice',
    },
    {
      title: 'LandingPage.Features.3.title',
      description: 'LandingPage.Features.3.description',
      icon: 'competition',
    },
    {
      title: 'LandingPage.Features.4.title',
      description: 'LandingPage.Features.4.description',
      icon: 'technology-2',
    },
    {
      title: 'LandingPage.Features.5.title',
      description: 'LandingPage.Features.5.description',
      icon: 'design',
    },
  ];
}
