import { Component, inject } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseLoadComponent } from '@core/common';
import { Observable } from 'rxjs';
import { LandingPageService } from '@app/modules/landing-page/landing-page.service';
import { NgSelectModule } from '@ng-select/ng-select';

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

@Component({
  selector: 'section-faq',
  standalone: true,
  imports: [CoreCommonModule, NgbAccordionModule, NgSelectModule],
  templateUrl: './section-faq.component.html',
  styleUrl: './section-faq.component.scss'
})
export class SectionFaqComponent extends BaseLoadComponent<FAQ[]> {
  public service = inject(LandingPageService);

  getData(): Observable<FAQ[]> | null {
    return this.service.getFAQ();
  }
}
