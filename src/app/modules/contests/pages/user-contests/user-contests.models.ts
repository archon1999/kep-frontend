import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

export interface Problem {
  id?: number;
  symbol?: string;
  ball?: number;
}

export interface Contest {
  title: string;
  startDate?: NgbDateStruct;
  startTime?: NgbTimeStruct;
  finishDate?: NgbDateStruct;
  finishTime?: NgbTimeStruct;
  type?: string;
  problems: Array<Problem>;
}
