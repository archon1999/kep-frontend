import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Arena } from '../../arena.models';

@Component({
  selector: 'arena-list-card',
  templateUrl: './arena-list-card.component.html',
  styleUrls: ['./arena-list-card.component.scss']
})
export class ArenaListCardComponent implements OnInit {

  @Input() arena: Arena;

  public leftTime: number;
  public durationMinute: number;

  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
    if(this.arena.status == -1){
      this.leftTime = new Date(this.arena.startTime).valueOf() - Date.now();
    }
    this.durationMinute = (new Date(this.arena.finishTime).valueOf() - new Date(this.arena.startTime).valueOf()) / 1000 / 60;
  }

  finish(){
    this.router.navigate(['/competitions', 'arena', 'tournament', this.arena.id]);
  }

}
