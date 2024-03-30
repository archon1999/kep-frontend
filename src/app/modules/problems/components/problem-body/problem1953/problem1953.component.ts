import { Component, OnInit } from '@angular/core';
import { randomInt } from '@shared/utils';
import { CoreCommonModule } from '@core/common.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@app/common';
import { interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'problem1953',
  templateUrl: './problem1953.component.html',
  styleUrls: ['./problem1953.component.scss'],
  standalone: true,
  imports: [CoreCommonModule, NgbTooltipModule]
})
export class Problem1953Component extends BaseComponent implements OnInit {
  public msg = 'KEPPEK';

  public top = 0;
  public left = 0;

  ngOnInit(): void {
    interval(50).pipe(takeUntil(this._unsubscribeAll)).subscribe(
      () => {
        this.changePosition();
      }
    );
  }

  changePosition() {
    this.top = randomInt(1, 500);
    this.left = randomInt(1, 500);
  }
}
