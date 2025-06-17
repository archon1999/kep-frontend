import { Component, Input } from '@angular/core';
import { fadeInLeftOnEnterAnimation } from 'angular-animations';
import { Test } from "@testing/domain";

@Component({
  selector: 'test-detail-card',
  templateUrl: './test-card.component.html',
  styleUrls: ['./test-card.component.scss'],
  standalone: false,
})
export class TestCardComponent {
  @Input() test: Test;
}
