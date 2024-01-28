import { Component } from '@angular/core';
import { CoreCommonModule } from '@core/common.module';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'section-faq',
  standalone: true,
  imports: [CoreCommonModule, NgbAccordionModule],
  templateUrl: './section-faq.component.html',
  styleUrl: './section-faq.component.scss'
})
export class SectionFaqComponent {
  public faqs = [
    {
      question: 'KEP so`zi nimani anglatadi?',
      answer: '',
    },
    {
      question: 'Platformani kim yaratgan?',
      answer: '',
    },
    {
      question: 'Tizimda monetizatsiya mavjudmi?',
      answer: '',
    },
    {
      question: 'Kepcoin nima?',
      answer: '',
    },
    {
      question: 'Qanday ro`yhatdan o`tiladi?',
      answer: '',
    },
    {
      question: 'Jo`natish tugmasi qayerda?',
      answer: '',
    },
  ];
}
