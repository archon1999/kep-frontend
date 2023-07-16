import { Component, OnInit } from '@angular/core';
import { HomeService } from '../home.service';

@Component({
  selector: 'statistics-section',
  templateUrl: './statistics-section.component.html',
  styleUrls: ['./statistics-section.component.scss']
})
export class StatisticsSectionComponent implements OnInit {

  public statistics: {
    usersCount: 0,
    contestsCount: 0,
    problemsCount: 0,
    attemptsCount: 0,
  };

  constructor(
    public service: HomeService,
  ) { }

  ngOnInit(): void {
    this.service.getStatistics().subscribe((result: any) => {
      this.statistics = result;
    })
  }

}
