import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Arena } from '../../arena.models';
import { CommonModule } from '@angular/common';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ChallengesUserViewModule } from '@challenges/components/challenges-user-view/challenges-user-view.module';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'arena-list-card',
  templateUrl: './arena-list-card.component.html',
  styleUrls: ['./arena-list-card.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    CountdownComponent,
    NgbTooltipModule,
    ChallengesUserViewModule,
  ]
})
export class ArenaListCardComponent implements OnInit {

  @Input() arena: Arena;

  public leftTime: number;
  public durationMinute: number;

  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
    if(this.arena.status == -1){
      this.leftTime = new Date(this.arena.startTime).valueOf() - Date.now();
    }
    this.durationMinute = (new Date(this.arena.finishTime).valueOf() - new Date(this.arena.startTime).valueOf()) / 1000 / 60;
  }

  finish(){
    this.router.navigate(['/competitions', 'arena', 'tournament', this.arena.id]);
  }

}
