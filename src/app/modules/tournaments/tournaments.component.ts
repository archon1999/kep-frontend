import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  fadeInLeftOnEnterAnimation,
  fadeInOnEnterAnimation,
  fadeInRightOnEnterAnimation,
  fadeInUpOnEnterAnimation
} from 'angular-animations';
import { Tournament } from './tournaments.models';
import { TournamentsService } from './tournaments.service';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeInUpOnEnterAnimation(),
    fadeInLeftOnEnterAnimation(),
    fadeInRightOnEnterAnimation(),
  ]
})
export class TournamentsComponent implements OnInit {

  public tournaments: Array<Tournament> = [];

  constructor(
    public service: TournamentsService,
    public route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(({ tournaments }) => {
      this.tournaments = tournaments;
    });
  }

}
