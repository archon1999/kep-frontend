import { Component, Input } from '@angular/core';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { Test } from "@testing/domain";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'test-detail-list-card',
  templateUrl: './test-list-card.component.html',
  styleUrls: ['./test-list-card.component.scss'],
  standalone: true,
  imports: [
    RouterLink
  ]
})
export class TestListCardComponent {
  @Input() test: Test;
}
