import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';
import { CommonModule } from '@angular/common';
import { CountUpModule } from 'ngx-countup';
import { TranslateModule } from '@ngx-translate/core';

interface IStatistics {
  usersCount: number;
  contestsCount: number;
  problemsCount: number;
  attemptsCount: number;
}

@Component({
  selector: 'statistics-section',
  templateUrl: './statistics-section.component.html',
  styleUrls: ['./statistics-section.component.scss'],
  standalone: true,
  imports: [CommonModule, CountUpModule, TranslateModule]
})
export class StatisticsSectionComponent implements OnInit {

  public statistics: IStatistics = {
    usersCount: 0,
    contestsCount: 0,
    problemsCount: 0,
    attemptsCount: 0,
  };

  constructor(
    public service: HomeService,
  ) { }

  ngOnInit(): void {
    this.service.getStatistics().subscribe(
      (result: IStatistics) => {
        this.statistics = result;
      }
    );
  }

}
