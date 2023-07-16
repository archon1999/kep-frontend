import { Component, Input, OnInit } from '@angular/core';
import { Achievement } from 'app/main/users/users.models';

@Component({
  selector: 'achievement',
  templateUrl: './achievement.component.html',
  styleUrls: ['./achievement.component.scss']
})
export class AchievementComponent implements OnInit {

  @Input() achievement: Achievement;

  public hover = false;

  constructor() { }

  getColor(){
    if(this.achievement.type == 2){
      return 'danger';
    }

    if(this.achievement.type == 4){
      return 'warning';
    }

    if(this.achievement.type == 5){
      return 'dark';
    }

    return 'primary';
  }

  ngOnInit(): void {
  }

}
