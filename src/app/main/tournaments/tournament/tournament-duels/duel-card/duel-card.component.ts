import { Component, Input, OnInit } from '@angular/core';
import { Duel } from 'app/main/duels/duels.models';

@Component({
  selector: 'duel-card',
  templateUrl: './duel-card.component.html',
  styleUrls: ['./duel-card.component.scss']
})
export class DuelCardComponent implements OnInit {

  @Input() duel: Duel;

  constructor() { }

  ngOnInit(): void {
  }

}
