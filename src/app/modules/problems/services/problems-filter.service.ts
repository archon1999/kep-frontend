import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProblemsFilter } from '../models/problems.models';

export const DEFAULT_FILTER: ProblemsFilter = {
  title: null,
  tags: [],
  difficulty: null,
  status: null,
  topic: null,
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
  private _filter = new BehaviorSubject<ProblemsFilter>(DEFAULT_FILTER);

  get currentFilterValue() {
    return this._currentFilter;
  }

  getFilter() {
    return this._filter;
  }

  updateFilter(filter: Partial<ProblemsFilter>, emit = true) {
    this._currentFilter = {
      ...this._currentFilter,
      ...filter,
    };
    if (emit) {
      this._filter.next(this._currentFilter);
    }
  }

  setFilter(filter: Partial<ProblemsFilter>) {
    this._currentFilter = {
      ...DEFAULT_FILTER,
      ...filter,
    };
    this._filter.next(this._currentFilter);
  }

}
