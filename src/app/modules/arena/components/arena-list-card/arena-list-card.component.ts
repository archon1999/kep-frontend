import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Arena, ArenaStatus } from '../../arena.models';
import { CountdownComponent } from '@shared/third-part-modules/countdown/countdown.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreCommonModule } from '@core/common.module';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { ChallengesUserViewComponent } from '@challenges/components/challenges-user-view/challenges-user-view.component';

@Component({
  selector: 'arena-list-card',
  templateUrl: './arena-list-card.component.html',
  styleUrls: ['./arena-list-card.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    CountdownComponent,
    NgbTooltipModule,
    ChallengesUserViewComponent,
    KepIconComponent,
  ]
})
export class ArenaListCardComponent implements OnInit {

  @Input() arena: Arena;

  public leftTime: number;
  public durationMinute: number;
  protected readonly ArenaStatus = ArenaStatus;

  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
    if (this.arena.status === -1) {
      this.leftTime = new Date(this.arena.startTime).valueOf() - Date.now();
    }
    this.durationMinute = (new Date(this.arena.finishTime).valueOf() - new Date(this.arena.startTime).valueOf()) / 1000 / 60;
  }

  finish() {
    this.router.navigate(['/competitions', 'arena', 'tournament', this.arena.id]);
  }
}
