import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { BracketsManager } from 'brackets-manager';
import { Tournament, TournamentPlayer } from '../../tournaments.models';
import { InMemoryDatabase } from './memory';

function getNearestPowTwo(x: number){
  let p = 1;
  while(p < x){
    p *= 2;
  }
  return p;
}

async function process(tournament: Tournament) {
  const db = new InMemoryDatabase();
  const manager = new BracketsManager(db);

  let participants = [];
  for(let stageDuel of tournament.stages[0].duels) {
    participants.push({
      tournament_id: 0,
      id: stageDuel.duel.playerFirst.id,
      name: stageDuel.duel.playerFirst.username,
    })
    participants.push({
      tournament_id: 0,
      id: stageDuel.duel.playerSecond.id,
      name: stageDuel.duel.playerSecond.username,
    })
  }

  db.setData({
    participant: participants,
    stage: [],
    group: [],
    round: [],
    match: [],
    match_game: [],
  });

  await manager.create({
    name: 'Knockout',
    tournamentId: 0,
    type: 'single_elimination',
    seeding: participants.map((player) => player.name),
    settings: {
      seedOrdering: ['natural'],
      size: getNearestPowTwo(tournament.players.length),
    },
  });
  
  let matchId = 0;
  for(let stage of tournament.stages){
    for(let stageDuel of stage.duels){
      if(stageDuel.duel && stageDuel.duel.playerSecond) {
        if(stageDuel.duel.status == null) continue

        let opponent1: any = {
          id: stageDuel.duel.playerFirst.id,
        }
        if(stageDuel.duel.status == 1){
          opponent1.result = ['loss', 'draw', 'win'][stageDuel.duel.playerFirst.status+1];
        }
        let opponent2: any = {
          id: stageDuel.duel.playerSecond.id,
        }
        if(stageDuel.duel.status == 1){
          opponent2.result = ['loss', 'draw', 'win'][stageDuel.duel.playerSecond.status+1];
        }  
        await manager.update.match({
          id: matchId,
          status: 4,
          opponent1: opponent1,
          opponent2: opponent2,
        })
      }
      matchId++;
    }
  }
  
  const data = await manager.get.stageData(0);

  return {
    stages: data.stage,
    matches: data.match,
    matchGames: data.match_game,
    participants: data.participant,
  };
}


@Component({
  selector: 'tournament-bracket',
  templateUrl: './tournament-bracket.component.html',
  styleUrls: ['./tournament-bracket.component.scss'],
})
export class TournamentBracketComponent implements OnInit {

  @Input() tournament: Tournament;

  constructor() { }

  ngOnInit(): void {
    if(this.tournament.stages.length > 0){
      process(this.tournament).then((data) => window['bracketsViewer'].render(data));
      let participantImages = [];
      for(let player of this.tournament.players){
        participantImages.push(
          {
            participantId: player.id,
            imageUrl: `assets/images/contests/ratings/${player.ratingTitle.toLowerCase()}.png`
          }
        )
      }
      setTimeout(() => {      
        let elements = document.getElementsByClassName('round');
        let n = getNearestPowTwo(this.tournament.players.length);
        for(let i = 0; i < elements.length; i++){
          if(elements[i].tagName == 'ARTICLE'){
            n >>= 1;
            let el = elements[i];
            let h3 = el.getElementsByTagName('h3');
            if(n == 1){
              h3[0].innerHTML = 'Final';
            } else {
              h3[0].innerHTML = `1/${n} Final`;
            }
          }
        }
      }, 100);
      window['bracketsViewer'].setParticipantImages(
        participantImages
      )
    }
  }

}