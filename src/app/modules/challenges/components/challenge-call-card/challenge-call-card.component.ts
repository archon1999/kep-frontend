import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ChallengesApiService } from '@challenges/services';
import { CoreCommonModule } from '@core/common.module';
import { getResourceById, Resources } from '@app/resources';
import { BaseUserComponent } from '@app/common/classes/base-user.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { ChallengesUserViewComponent } from '@challenges/components/challenges-user-view/challenges-user-view.component';
import { ChallengeCall } from '@challenges/interfaces/challenge-call';

@Component({
  selector: 'challenge-call-card',
  templateUrl: './challenge-call-card.component.html',
  styleUrls: ['./challenge-call-card.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ChallengesUserViewComponent,
    NgbTooltipModule,
  ]
})
export class ChallengeCallCardComponent extends BaseUserComponent {

  @Input() challengeCall: ChallengeCall;
  @Output() delete = new EventEmitter<void>();

  constructor(
    public service: ChallengesApiService,
    public router: Router,
  ) {
    super();
  }

  deleteChallengeCall() {
    this.service.deleteChallengeCall(this.challengeCall.id).subscribe(
      (result: any) => {
        if (result.success) {
          this.delete.next(null);
        }
      }
    );
  }

  acceptChallengeCall() {
    if (!this.currentUser) {
      this.router.navigateByUrl(Resources.Login);
      return;
    }

    this.service.acceptChallengeCall(this.challengeCall.id).subscribe(
      (result: any) => {
        if (result.success) {
          const challengeId = result.challengeId;
          this.router.navigateByUrl(getResourceById(Resources.Challenge, challengeId));
        }
      }
    );
  }

}
