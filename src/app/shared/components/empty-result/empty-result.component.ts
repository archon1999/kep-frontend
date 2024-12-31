import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { GlobalService } from '@app/common/global.service';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'empty-result',
  standalone: true,
  imports: [
    KepIconComponent,
    TranslateModule
  ],
  templateUrl: './empty-result.component.html',
  styleUrl: './empty-result.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class EmptyResultComponent {
  @Input() title = 'NoResultFound';
  @Input() text = 'NoResultFoundText';
}
