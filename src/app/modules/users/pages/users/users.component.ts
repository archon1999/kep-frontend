import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { colors } from '../../../../colors.const';
import { UsersService } from '../../users.service';
import { CurrentUser } from 'app/shared/components/classes/current-user.component';
import { AuthenticationService } from 'app/auth/service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent extends CurrentUser {

  public ordering = '-skills_rating';

  public users: Array<any> = [];
  public totalUsers: number = 0;
  public currentPage = 1;

  public contentHeader = {
    headerTitle: 'MENU.USERS',
    actionButton: true,
    breadcrumb: {
      type: '',
      links: [
        {
          name: 'CPython.uz',
          isLink: false,
          link: '/'
        },
      ]
    }
  };

  constructor(
    public service: UsersService,
    public translateService: TranslateService,
    public authService: AuthenticationService,
  ) {
    super(authService);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadUsers();
  }

  loadUsers(){
    this.service.getUsers(this.currentPage, true, this.ordering).subscribe(
      (result: any) => {
        this.users = result.data;
        this.totalUsers = result.total;
      }
    )
  }

  changeOrdering(ordering: string){
    this.ordering = ordering;
    this.loadUsers();
  }

}
