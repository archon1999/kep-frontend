import { Component } from '@angular/core';
import { AuthUser } from '@auth';
import { CoreCommonModule } from '@core/common.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@app/common/classes/base.component';
import { WebsocketService } from '@shared/services/websocket';

@Component({
  selector: 'header-kepcoin',
  templateUrl: './header-kepcoin.component.html',
  styleUrls: ['./header-kepcoin.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbPopoverModule,
  ]
})
export class HeaderKepcoinComponent extends BaseComponent {

  public earn = 0;
  public spend = 0;

  constructor(
    public wsService: WebsocketService,
  ) {
    super();
  }

  loadData() {
    this.api.get('today-kepcoin').subscribe(
      (result: { earn: number, spend: number }) => {
        this.earn = result.earn;
        this.spend = result.spend;
      }
    );
  }

  override beforeChangeCurrentUser(currentUser: AuthUser) {
    if (currentUser) {
      this.wsService.send('kepcoin-add', currentUser.username);
      this.wsService.on<number>(`kepcoin-${currentUser.username}`).subscribe(
        (kepcoin: number) => {
          this.authService.updateKepcoin(kepcoin);
        }
      );
    } else {
      this.wsService.send('kepcoin-delete', this.currentUser?.username);
    }
  }
}
