import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'spinner',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  @Input() name: string;
  @Input() type = 'ball-clip-rotate-multiple';
  @Input() color = 'var(--primary)';
  @Input() bdColor = 'inherit';
}
