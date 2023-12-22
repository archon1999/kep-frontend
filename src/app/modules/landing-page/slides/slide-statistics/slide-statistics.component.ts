import { Component, Input, OnInit } from '@angular/core';
import { CoreConfigService } from '@core/services/config.service';
import { CoreConfig } from '@core/types';
import { fadeInDownAnimation, fadeInLeftAnimation, fadeInUpAnimation } from 'angular-animations';
import { ApiService } from '@shared/services/api.service';
import { CoreCommonModule } from '@core/common.module';
import { CountUpModule } from 'ngx-countup';

@Component({
  selector: 'slide-statistics',
  templateUrl: './slide-statistics.component.html',
  styleUrls: ['./slide-statistics.component.scss'],
  animations: [
    fadeInLeftAnimation({ duration: 1000 }),
    fadeInUpAnimation({ duration: 1000 }),
    fadeInDownAnimation({ duration: 1000 }),
  ],
  standalone: true,
  imports: [
    CoreCommonModule,
    CountUpModule,
  ]
})
export class SlideStatisticsComponent implements OnInit {

  @Input() animationState: boolean;

  public usersCount = 0;
  public contestsCount = 0;
  public problemsCount = 0;
  public attemptsCount = 0;

  public isDarkSkin = false;

  constructor(public api: ApiService, public coreConfigService: CoreConfigService) { }

  ngOnInit(): void {
    this.api.get('landing-page-statistics').subscribe((result: any) => {
      this.usersCount = result.usersCount;
      this.contestsCount = result.contestsCount;
      this.problemsCount = result.problemsCount;
      this.attemptsCount = result.attemptsCount;
    });

    this.coreConfigService.getConfig().subscribe(
      (coreConfig: CoreConfig) => {
        this.isDarkSkin = coreConfig.layout.skin === 'dark';
      }
    );
  }


}
