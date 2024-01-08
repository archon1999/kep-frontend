import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSkills, UserTechnology } from '@users/users.models';
import { ActivatedRoute } from '@angular/router';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'user-skills',
  standalone: true,
  imports: [
    CommonModule,
    NgbProgressbarModule,
    TranslateModule,
  ],
  templateUrl: './user-skills.component.html',
  styleUrl: './user-skills.component.scss'
})
export class UserSkillsComponent implements OnInit {
  public userSkills: UserSkills;
  public userTechnologies: Array<UserTechnology>;

  constructor(public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data.subscribe(({ userSkills, userTechnologies }) => {
      this.userTechnologies = userTechnologies;
      this.userSkills = userSkills;
    });
  }
}
