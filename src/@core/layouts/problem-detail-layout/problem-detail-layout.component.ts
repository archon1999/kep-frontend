import { Component } from '@angular/core';
import { HeaderComponent } from '@core/layouts/components/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-problem-detail-layout',
  templateUrl: './problem-detail-layout.component.html',
  styleUrl: './problem-detail-layout.component.scss',
  standalone: true,
  imports: [
    HeaderComponent,
    RouterOutlet,
  ]
})
export class ProblemDetailLayoutComponent {
}
