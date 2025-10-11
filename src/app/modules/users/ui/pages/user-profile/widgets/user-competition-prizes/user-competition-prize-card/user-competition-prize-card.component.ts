import { Component, Input, OnInit } from '@angular/core';
import { UserCompetitionPrize } from '@users/domain';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { getResourceById, Resources } from '@app/resources';
import { RouterLink } from '@angular/router';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { KepcoinViewModule } from '@shared/components/kepcoin-view/kepcoin-view.module';

@Component({
  selector: 'user-competition-prize-card',
  standalone: true,
  imports: [
    KepIconComponent,
    RouterLink,
    NgbTooltipModule,
    KepcoinViewModule
  ],
  templateUrl: './user-competition-prize-card.component.html',
  styleUrl: './user-competition-prize-card.component.scss'
})
export class UserCompetitionPrizeCardComponent implements OnInit {
  @Input() competitionPrize: UserCompetitionPrize;

  public competitionLink: string;

  ngOnInit() {
    if (this.competitionPrize.competitionType === 'CONTEST') {
      this.competitionLink = getResourceById(Resources.Contest, this.competitionPrize.competitionId);
    } else if (this.competitionPrize.competitionType === 'ARENA') {
      this.competitionLink = getResourceById(Resources.ArenaTournament, this.competitionPrize.competitionId);
    } else if (this.competitionPrize.competitionType === 'TOURNAMENT') {
      this.competitionLink = getResourceById(Resources.Tournament, this.competitionPrize.competitionId);
    }
  }
}
