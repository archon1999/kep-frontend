import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Problem, ProblemsFilter } from '@problems/models/problems.models';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { DEFAULT_FILTER, ProblemsFilterService } from '@problems/services/problems-filter.service';
import { BaseComponent } from '@shared/components/classes/base.component';
import { SpinnersEnum } from '@shared/components/spinner/spinners.enum';

@Component({
  selector: 'section-problems-table',
  templateUrl: './section-problems-table.component.html',
  styleUrls: ['./section-problems-table.component.scss'],
  animations: [fadeInOnEnterAnimation({ duration: 1000 })]
})
export class SectionProblemsTableComponent extends BaseComponent implements OnInit, OnDestroy {

  @Input() problems: Array<Problem>;

  public filter: ProblemsFilter = DEFAULT_FILTER;
  public ordering: string;

  public spinnerShow = true;
  public SpinnersEnum = SpinnersEnum;

  constructor(
    public filterService: ProblemsFilterService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.spinner.getSpinner(SpinnersEnum.ProblemsTable).subscribe(
      (spinner) => {
        this.spinnerShow = spinner.show;
      }
    );

    this.filterService.getFilter().pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (filter: ProblemsFilter) => {
        this.filter = filter;
        this.ordering = filter.ordering;
      }
    );
  }

  changeOrdering(ordering: string) {
    this.ordering = ordering;
    this.updateQueryParams({ ordering: ordering });
    this.filterService.updateFilter({ ordering: ordering });
  }

  tagOnClick(tagId: number) {
    const tags = this.filter.tags;
    const index = this.filter.tags.indexOf(tagId);
    if (index === -1) {
      tags.push(tagId);
    } else {
      tags.splice(index, 1);
    }
    this.filterService.updateFilter({ tags: tags });
  }

}
