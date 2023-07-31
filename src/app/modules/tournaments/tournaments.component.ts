import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { fadeInLeftOnEnterAnimation, fadeInOnEnterAnimation, fadeInRightOnEnterAnimation, fadeInUpOnEnterAnimation } from 'angular-animations';
import { Tournament } from './tournaments.models';
import { TournamentsService } from './tournaments.service';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss'],
  animations: [
    fadeInOnEnterAnimation({ duration: 3000 }),
    fadeInUpOnEnterAnimation({ duration: 3000 }),
    fadeInLeftOnEnterAnimation({ duration: 3000 }),
    fadeInRightOnEnterAnimation({ duration: 3000 }),
  ]
})
export class TournamentsComponent implements OnInit {

  public tournaments: Array<Tournament> = [];

  constructor(
    public service: TournamentsService,
    public route: ActivatedRoute,
  ){}

  ngOnInit(): void {
    this.route.data.subscribe(({ tournaments }) => {
      this.tournaments = tournaments;
    })
  }

}
