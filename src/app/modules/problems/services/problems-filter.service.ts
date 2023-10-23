import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ProblemsFilter } from '../models/problems.models';

export const DEFAULT_FILTER: ProblemsFilter = {
  page: 1,
  pageSize: 20,
  title: null,
  tags: [],
  difficulty: null,
  status: null,
  topic: null,
  ordering: 'id',
  hasChecker: null,
  hasCheckInput: null,
  hasSolution: null,
  partialSolvable: null,
};

@Injectable({
  providedIn: 'root'
})
export class ProblemsFilterService {

  private _currentFilter = DEFAULT_FILTER;
  private _filter = new Subject<ProblemsFilter>();

  constructor() {}

  get currentFilterValue(){
    return this._currentFilter;
  }

  getFilter() {
    return this._filter;
  }

  updateFilter(filter: Partial<ProblemsFilter>) {
    this._currentFilter = {
      ...this._currentFilter,
      ...filter,
    };
    this._filter.next(this._currentFilter);
  }

  setFilter(filter: Partial<ProblemsFilter>) {
    this._currentFilter = {
      ...DEFAULT_FILTER,
      ...filter,
    };
    this._filter.next(this._currentFilter);
  }

}
