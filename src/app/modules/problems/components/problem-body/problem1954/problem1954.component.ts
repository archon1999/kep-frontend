import { Component, HostListener, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { CoreCommonModule } from '@core/common.module';

const message = 'Reskep';

@Component({
  selector: 'problem1954',
  templateUrl: './problem1954.component.html',
  styleUrls: ['./problem1954.component.scss'],
  standalone: true,
  imports: [
    CountdownComponent,
    CoreCommonModule
  ]
})
export class Problem1954Component {
  @ViewChild('countdown') countdown: CountdownComponent;

  constructor(
    public toastr: ToastrService,
  ) { }

  finish() {
    this.toastr.success(message);
  }

  @HostListener('window:blur') onBlur() {
    this.countdown.reset();
  }

  @HostListener('window:focus') onFocus() {
    this.countdown.reset();
  }
}
