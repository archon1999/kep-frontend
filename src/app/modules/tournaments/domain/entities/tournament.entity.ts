import { Duel } from "@app/modules/duels/duels.interfaces";

export interface TournamentPlayer {
  id: number;
  username: string;
  ratingTitle: string;
}

export interface TournamentStageDuel {
  duel?: Duel;
  number: number;
}

export interface TournamentStage {
  number: number;
  title: string;
  duels: Array<TournamentStageDuel>;
  startTime: Date;
}

export interface Tournament {
  id: number;
  title: string;
  description?: string;
  type: string;
  startTime: string | Date;
  isRegistered: boolean;
  playersCount?: number;
  players?: Array<TournamentPlayer>;
  stages?: Array<TournamentStage>;
}
