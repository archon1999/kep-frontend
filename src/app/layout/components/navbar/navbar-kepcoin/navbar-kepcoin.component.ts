import { Component } from '@angular/core';
import { User } from 'app/auth/models';
import { NavbarService } from '../navbar.service';
import { CoreCommonModule } from '@core/common.module';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '@app/common/classes/base.component';

@Component({
  selector: 'app-navbar-kepcoin',
  templateUrl: './navbar-kepcoin.component.html',
  styleUrls: ['./navbar-kepcoin.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    NgbPopoverModule,
  ]
})
export class NavbarKepcoinComponent extends BaseComponent {

  public earn = 0;
  public spend = 0;

  constructor(
    public service: NavbarService,
  ) {
    super();
  }

  loadData() {
    this.service.getTodayKepcoin().subscribe(
      (result: { earn: number, spend: number }) => {
        this.earn = result.earn;
        this.spend = result.spend;
      }
    );
  }

  beforeChangeCurrentUser(currentUser: User) {
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

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
