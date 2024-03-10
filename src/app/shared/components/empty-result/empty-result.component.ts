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
export class EmptyResultComponent implements OnInit {
  @Input() imgHeight: string;
  @Input() imgWidth: string;

  public imgSrc: string;

  constructor(public globalService: GlobalService) {}

  ngOnInit() {
    this.globalService.coreConfig$.subscribe(
      (config) => {
        if (config.layout.skin === 'dark') {
          this.imgSrc = 'assets/images/elements/search-not-found-dark.png';
        } else {
          this.imgSrc = 'assets/images/elements/search-not-found-light.png';
        }
      }
    );
  }

}
