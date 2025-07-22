import { Component, inject, Input } from '@angular/core';
import { BaseLoadComponent } from '@core/common';
import { UserCompetitionPrize } from '@users/domain';
import { Observable } from 'rxjs';
import { SpinnerComponent } from '@shared/components/spinner/spinner.component';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyResultComponent } from '@shared/components/empty-result/empty-result.component';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import {
  UserCompetitionPrizeCardComponent
} from "@users/ui/pages/user-profile/user-competition-prizes/user-competition-prize-card/user-competition-prize-card.component";
import { UsersApiService } from "@app/modules/users";

@Component({
  selector: 'user-competition-prizes',
  standalone: true,
  imports: [
    SpinnerComponent,
    TranslateModule,
    UserCompetitionPrizeCardComponent,
    EmptyResultComponent,
    KepCardComponent,
    UserCompetitionPrizeCardComponent
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
