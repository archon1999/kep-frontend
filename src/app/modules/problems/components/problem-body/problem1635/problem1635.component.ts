import { Component, OnInit } from '@angular/core';
import { User } from 'app/auth/models';
import { AuthService } from 'app/auth/service';

@Component({
  selector: 'problem1635',
  templateUrl: './problem1635.component.html',
  styleUrls: ['./problem1635.component.scss']
})
export class Problem1635Component implements OnInit {

  public words = ['har', 'bir', 'odamda', 'bitta', 'bo`lak', 'bo`larklar', 'sonini', 'toping'];

  public index = 7;

  constructor(
    public authService: AuthService
  ) {
    this.authService.currentUser.subscribe(
      (user: User) => {
        if(user?.username){
          let s = 0;
          for(let i = 0; i < user.username.length; i++){
            s += user.username.charCodeAt(i);
          }
          this.index = s % this.words.length;
        }
      }
    )
  }

  ngOnInit(): void {

  }

}
