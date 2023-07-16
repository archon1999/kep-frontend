import { Component, OnInit } from '@angular/core';
import { fadeInLeftOnEnterAnimation, fadeInRightOnEnterAnimation, fadeInUpOnEnterAnimation, fadeOutDownAnimation, fadeOutDownOnLeaveAnimation, fadeOutLeftAnimation, fadeOutLeftOnLeaveAnimation, fadeOutRightAnimation, fadeOutRightOnLeaveAnimation } from 'angular-animations';
import { User } from '../../../users/users.models';
import { UsersService } from '../../../users/users.service';

@Component({
  selector: 'app-tournament-versus',
  templateUrl: './tournament-versus.component.html',
  styleUrls: ['./tournament-versus.component.scss'],
  animations: [
    fadeInLeftOnEnterAnimation({ duration: 3000 }),
    fadeInRightOnEnterAnimation({ duration: 3000 }),
    fadeInUpOnEnterAnimation({ duration: 3000 }),
    fadeOutLeftAnimation({ duration: 3000 }),
    fadeOutRightAnimation({ duration: 3000 }),
    fadeOutDownAnimation({ duration: 3000 }),
  ]
})
export class TournamentVersusComponent implements OnInit {

  public state = false;

  public userFirst: User;
  public userSecond: User;

  public usernameFirst = 'MDSPro';
  public usernameSecond = 'Haytboyev.Asadbek';

  public textColor = 'text-danger';
  public style = 'text-decoration: line-through;';

  public round = '1/8 Final';

  constructor(
    public usersService: UsersService,
  ) { }

  ngOnInit(): void {
    this.loadUsers();

    setTimeout(() => {
      this.state = !this.state;
      setTimeout(() => {
        this.round = '1/4 Final';
        this.usernameSecond = 'jshohrux';
        this.userSecond = null;
        this.userFirst = null;
        this.loadUsers();        

        setTimeout(() => {
          this.state = !this.state;
          setTimeout(() => {
            this.round = '1/2 Final';
            this.usernameSecond = 'The_Samurai';
            this.userSecond = null;
            this.userFirst = null;
            this.loadUsers();

            setTimeout(() => {
              this.userFirst = null;
              this.round = '1/8 Final';
              this.usernameFirst = 'NarzullayevMe';
              this.usernameSecond = 'Shoxrux';
              this.loadUsers();        
              this.state = !this.state;
              
              setTimeout(() => {
                this.userSecond = null;
                this.userFirst = null;
                this.round = '1/4 Final';
                this.usernameSecond = 'ThA';
                this.loadUsers();        
                this.state = !this.state;
  
                setTimeout(() => {
                  this.userSecond = null;
                  this.userFirst = null;
                  this.round = '1/2 Final';
                  this.usernameSecond = 'anonim.ghost.uz';
                  this.loadUsers();
                  setTimeout(() => {
                    this.userFirst = null;
                    setTimeout(() => {
                      setTimeout(() => {
                        this.userSecond = null;
                        this.userFirst = null;
                        this.textColor = 'text-dark';
                        this.round = 'Final';
                        this.style = '';
                        this.usernameFirst = 'MDSPro';
                        this.usernameSecond = 'NarzullayevMe';
                        this.loadUsers();
    
                        setTimeout(() => {
                          this.state = !this.state
                        }, 3000);
      
                      }, 3000);    
                    }, 3000);
                  }, 3000);
                }, 3000);    
              }, 3000);
            }, 3000);
      
          }, 3000);
        }, 3000);
      }, 3000);
    }, 3000);
  }

  loadUsers(){
    this.usersService.getUser(this.usernameFirst).subscribe(
      (user: any) => {
        this.userFirst = user;
      }
    )

    this.usersService.getUser(this.usernameSecond).subscribe(
      (user: any) => {
        this.userSecond = user;
      }
    )
  }
}
