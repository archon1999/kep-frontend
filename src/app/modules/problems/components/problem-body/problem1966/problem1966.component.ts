import { Component, inject, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'problem1966',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './problem1966.component.html',
  styleUrl: './problem1966.component.scss'
})
export class Problem1966Component implements OnInit {
  simbirgiBoolean = true;

  public translateService = inject(TranslateService);

  ngOnInit() {
    setTimeout(() => {
      this.simbirgiBoolean = false;
    }, 150);
  }
}
