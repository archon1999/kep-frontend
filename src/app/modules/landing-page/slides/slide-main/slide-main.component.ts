import { Component, Input, OnInit } from '@angular/core';
import { CoreConfigService } from '../../../../../@core/services/config.service';
import { CoreConfig } from '../../../../../@core/types';
import { fadeInLeftAnimation, fadeInRightAnimation } from 'angular-animations';

@Component({
  selector: 'slide-main',
  templateUrl: './slide-main.component.html',
  styleUrls: ['./slide-main.component.scss'],
  animations: [
    fadeInLeftAnimation({ duration: 1000 }),
    fadeInRightAnimation({ duration: 1000 }),
  ]
})
export class SlideMainComponent implements OnInit {

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
