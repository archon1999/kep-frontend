import { Component, Input, OnInit } from '@angular/core';
import { Duel } from '../../../../duels/duels.interfaces';

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
