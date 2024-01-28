import { Component, OnInit } from '@angular/core';
import { LandingPageService } from '@app/modules/landing-page/landing-page.service';
import { CoreCommonModule } from '@core/common.module';
import { CountUpModule } from 'ngx-countup';

interface Statistics {
  usersCount: number;
  contestsCount: number;
  problemsCount: number;
  attemptsCount: number;
}

@Component({
  selector: 'section-statistics',
  standalone: true,
  imports: [CoreCommonModule, CountUpModule],
  templateUrl: './section-statistics.component.html',
  styleUrl: './section-statistics.component.scss'
})
export class SectionStatisticsComponent implements OnInit {
  public statistics: Statistics;

  constructor(public service: LandingPageService) {}

  ngOnInit() {
    this.service.getStatistics().subscribe(
      (statistics) => {
        this.statistics = statistics;
      }
    );
  }
}
