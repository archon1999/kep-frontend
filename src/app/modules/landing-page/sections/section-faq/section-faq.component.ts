import { Component, inject } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseLoadComponent } from '@app/common';
import { Observable } from 'rxjs';
import { LandingPageService } from '@app/modules/landing-page/landing-page.service';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

@Component({
  selector: 'section-faq',
  standalone: true,
  imports: [CoreCommonModule, NgbAccordionModule],
  templateUrl: './section-faq.component.html',
  styleUrl: './section-faq.component.scss'
})
export class SectionFaqComponent extends BaseLoadComponent<FAQ[]> {
  public service = inject(LandingPageService);

  getData(): Observable<FAQ[]> | null {
    return this.service.getFAQ();
  }
}
