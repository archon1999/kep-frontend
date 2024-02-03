import { Component } from '@angular/core';
import { AuthService, User } from '@auth';
import { CoreCommonModule } from '@core/common.module';

@Component({
  selector: 'problem1635',
  templateUrl: './problem1635.component.html',
  styleUrls: ['./problem1635.component.scss'],
  standalone: true,
  imports: [CoreCommonModule]
})
export class Problem1635Component {

  public words = ['har', 'bir', 'odamda', 'bitta', 'bo`lak', 'bo`larklar', 'sonini', 'toping'];
  public index = 7;

  constructor(
    public authService: AuthService
  ) {
    this.authService.currentUser.subscribe(
      (user: User) => {
        if (user?.username) {
          let s = 0;
          for (let i = 0; i < user.username.length; i++) {
            s += user.username.charCodeAt(i);
          }
          this.index = s % this.words.length;
        }
      }
    );
  }

}
