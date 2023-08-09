import { Component, Input, OnInit } from '@angular/core';
import { CoreConfigService } from '../../../../../@core/services/config.service';
import { CoreConfig } from '../../../../../@core/types';
import { fadeInDownAnimation, fadeInLeftAnimation, fadeInUpAnimation } from 'angular-animations';
import { ApiService } from '../../../../shared/services/api.service';

@Component({
  selector: 'slide-statistics',
  templateUrl: './slide-statistics.component.html',
  styleUrls: ['./slide-statistics.component.scss'],
  animations: [
    fadeInLeftAnimation({ duration: 1000 }),
    fadeInUpAnimation({ duration: 1000 }),
    fadeInDownAnimation({ duration: 1000 }),
  ]
})
export class SlideStatisticsComponent implements OnInit {

  @Input() animationState: boolean;

  public usersCount: number = 0;
  public contestsCount: number = 0;
  public problemsCount: number = 0;
  public attemptsCount: number = 0;
  
  public isDarkSkin: boolean = false;

  constructor(public api: ApiService, public coreConfigService: CoreConfigService) { }

  ngOnInit(): void {
    this.api.get('landing-page-statistics').subscribe((result: any) => {
      this.usersCount = result.usersCount;
      this.contestsCount = result.contestsCount;
      this.problemsCount = result.problemsCount;
      this.attemptsCount = result.attemptsCount;
    })

    this.coreConfigService.getConfig().subscribe(
      (coreConfig: CoreConfig) => {
        this.isDarkSkin = coreConfig.layout.skin == 'dark';
      }
    )
  }


}
