import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@core/layouts/components/header/header.component';

@Component({
  selector: 'app-problem-layout',
  standalone: true,
  templateUrl: './problem-layout.component.html',
  styleUrl: './problem-layout.component.scss',
  imports: [RouterOutlet, HeaderComponent],
})
export class ProblemLayoutComponent {}
