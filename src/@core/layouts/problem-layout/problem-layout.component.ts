import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '@core/layouts/components/header/header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-problem-layout',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet],
  templateUrl: './problem-layout.component.html',
  styleUrls: ['./problem-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemLayoutComponent {}
