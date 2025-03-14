import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'problem1639',
  templateUrl: './problem1639.component.html',
  styleUrls: ['./problem1639.component.scss'],
  standalone: true,
  imports: [
    CountdownComponent,
    CoreCommonModule
  ]
})
export class Problem1639Component {
  constructor(
    public toastr: ToastrService,
  ) { }

  finish() {
    this.toastr.success('Oltinni tagi sabr!');
  }
}
