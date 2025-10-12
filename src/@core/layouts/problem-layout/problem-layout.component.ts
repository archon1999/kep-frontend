import { Component } from '@angular/core';
import { HeaderComponent } from '@core/layouts/components/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-problem-layout',
  standalone: true,
  templateUrl: './problem-layout.component.html',
  styleUrl: './problem-layout.component.scss',
  imports: [
    HeaderComponent,
    RouterOutlet,
  ],
})
export class ProblemLayoutComponent {}
