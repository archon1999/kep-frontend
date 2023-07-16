import { Component, Input, OnInit } from '@angular/core';
import { CoreConfigService } from '../../../../../@core/services/config.service';
import { CoreConfig } from '../../../../../@core/types';
import { fadeInDownAnimation, fadeInLeftAnimation, fadeInRightAnimation, fadeInUpAnimation } from 'angular-animations';

@Component({
  selector: 'slide-practice',
  templateUrl: './slide-practice.component.html',
  styleUrls: ['./slide-practice.component.scss'],
  animations: [
    fadeInUpAnimation({ duration: 1000 }),
    fadeInDownAnimation({ duration: 1000 }),
    fadeInLeftAnimation({ duration: 1000 }),
    fadeInRightAnimation({ duration: 1000 }),
  ]
})
export class SlidePracticeComponent implements OnInit {

  @Input() animationState: boolean;

  public isDarkSkin: boolean = false;

  constructor(public coreConfigService: CoreConfigService) { }

  ngOnInit(): void {
    this.coreConfigService.getConfig().subscribe(
      (coreConfig: CoreConfig) => {
        this.isDarkSkin = coreConfig.layout.skin == 'dark';
      }
    )
  }
}
