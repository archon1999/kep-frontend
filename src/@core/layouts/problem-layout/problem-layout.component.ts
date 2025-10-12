import { Component } from '@angular/core';
import { HeaderComponent } from '@core/layouts/components/header/header.component';

@Component({
  selector: 'problem-layout',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './problem-layout.component.html',
  styleUrls: ['./problem-layout.component.scss']
})
export class ProblemLayoutComponent {}
