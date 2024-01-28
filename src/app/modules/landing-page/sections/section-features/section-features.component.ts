import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'section-features',
  standalone: true,
  imports: [CoreCommonModule],
  templateUrl: './section-features.component.html',
  styleUrl: './section-features.component.scss'
})
export class SectionFeaturesComponent {
  public features = [
    {
      title: 'LandingPage.SectionLearnTitle',
      description: 'LandingPage.SectionLearnText',
      icon: 'learn',
    },
    {
      title: 'Problems',
      description: 'LandingPage.SectionPracticeProblemsCardText',
      icon: 'problems',
    },
    {
      title: 'LandingPage.SectionLearnTitle',
      description: 'LandingPage.SectionLearnText',
      icon: 'learn',
    },
    {
      title: 'Zamonaviy dizayn',
      description: 'Platforma eng so`ngi texnologiyalar bilan yaratilgan bo`lib, unda barcha imkoniyatlar yaratilgan',
      icon: 'design',
    },
    {
      title: 'Problems',
      description: 'LandingPage.SectionPracticeProblemsCardText',
      icon: 'problems',
    },
    {
      title: 'Zamonaviy dizayn',
      description: 'Platforma eng so`ngi texnologiyalar bilan yaratilgan bo`lib, unda barcha imkoniyatlar yaratilgan',
      icon: 'design',
    },
  ];
}
