import { Component, inject, Input } from '@angular/core';
import { UsersApiService } from '@users/users-api.service';
import { BaseLoadComponent } from '@app/common';
import { UserCompetitionPrize } from '@users/users.models';
import { Observable } from 'rxjs';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  UserCompetitionPrizeCardComponent
} from '@users/pages/user-profile/user-competition-prizes/user-competition-prize-card/user-competition-prize-card.component';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'user-competition-prizes',
  standalone: true,
  imports: [
    SpinnerComponent,
    TranslateModule,
    UserCompetitionPrizeCardComponent,
    EmptyResultComponent,
    KepCardComponent
  ],
  templateUrl: './user-competition-prizes.component.html',
  styleUrl: './user-competition-prizes.component.scss'
})
export class UserCompetitionPrizesComponent extends BaseLoadComponent<UserCompetitionPrize[]> {
  @Input() username: string;
  private service = inject(UsersApiService);

  getData(): Observable<UserCompetitionPrize[]> {
    return this.service.getUserCompetitionPrizes(this.username);
  }
}
