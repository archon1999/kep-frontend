import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { randomInt } from '@shared/utils';

@Component({
  selector: 'spinner',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent implements OnInit, OnDestroy {
  @Input() name: string;
  @Input() type = 'ball-clip-rotate-multiple';
  @Input() color = 'var(--primary)';
  @Input() bdColor = 'inherit';
  @Input() size: 'small' | 'default' | 'medium' | 'large' = 'large';
  @Input() height: string;

  constructor(public spinner: NgxSpinnerService) {}

  ngOnInit() {
    if (!this.name) {
      this.name = randomInt(1, 10000).toString();
    }
    this.spinner.show(this.name);
  }

  ngOnDestroy() {
    this.spinner.hide(this.name);
  }
}
