import { Component, OnInit } from '@angular/core';
import { Category, ProblemsFilter, Tag } from '@problems/models/problems.models';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { ProblemsFilterService } from 'app/modules/problems/services/problems-filter.service';
import { BaseComponent } from '@core/common/classes/base.component';
import { FormControl, FormGroup } from '@angular/forms';
import { deepCopy, equalsCheck } from '@shared/utils';
import { CoreCommonModule } from '@core/common.module';
import { ProblemsPipesModule } from '@problems/pipes/problems-pipes.module';
import { NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';
import { takeUntil } from 'rxjs/operators';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";
import { langs } from "i18n-iso-countries";
import { AttemptLanguageComponent } from "@shared/components/attempt-language/attempt-language.component";

interface Difficulty {
  name: string;
  value: number;
}

@Component({
  selector: 'section-problems-filter',
  templateUrl: './section-problems-filter.component.html',
  styleUrls: ['./section-problems-filter.component.scss'],
  standalone: true,
  imports: [
    CoreCommonModule,
    ProblemsPipesModule,
    NgbDropdownModule,
    NgbAccordionModule,
    KepIconComponent,
    NgSelectModule,
    KepCardComponent,
    AttemptLanguageComponent,
  ]
})
export class SectionProblemsFilterComponent extends BaseComponent implements OnInit {

  public filterForm = new FormGroup({
    category: new FormControl(),
    search: new FormControl(),
    tags: new FormControl([]),
    difficulty: new FormControl(),
    status: new FormControl(),
    ordering: new FormControl(),
    lang: new FormControl(),
  });

  public tags: Array<Tag> = [];
  public categories: Array<Category> = [];
  public difficulties: Array<Difficulty> = [];
  public langOptions: Array<any> = [];
  public orderingOptions = [
    { label: 'ProblemsOrderNewestFirst', value: '-id' },
    { label: 'ProblemsOrderOldestFirst', value: 'id' },
    { label: 'ProblemsOrderEasiestFirst', value: 'difficulty,-solved' },
    { label: 'ProblemsOrderHardestFirst', value: '-difficulty,solved' },
    { label: 'ProblemsOrderMostSolvedFirst', value: '-solved' },
    { label: 'ProblemsOrderLeastSolvedFirst', value: 'solved' },
  ];

  public selectedTagsName: string;
  public problemsCount = 0;

  constructor(
    public service: ProblemsApiService,
    public filterService: ProblemsFilterService,
  ) {
    super();
  }

  get filter() {
    return this.filterService.currentFilterValue;
  }

  ngOnInit(): void {
    this.filterService.problemsCount$.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (value) => {
        this.problemsCount = value;
      }
    );

    this.service.getLangs().subscribe(
      (langs) => this.langOptions = langs
    )

    const queryParams = deepCopy(this.route.snapshot.queryParams);
    if (queryParams.tags && !(queryParams instanceof Array)) {
      queryParams.tags = [queryParams.tags];
    }

    this.filterForm.patchValue(queryParams, {emitEvent: false});

    this.filterForm.valueChanges.pipe(takeUntil(this._unsubscribeAll)).subscribe(
      (filterValue: ProblemsFilter) => {
        this.filterService.updateFilter(filterValue);
      }
    );

    this.service.getCategories().subscribe(
      (categories: Array<Category>) => {
        this.categories = categories;
        const tags = [];
        const categoryId = this.filterService.currentFilterValue.category;
        this.categories.forEach(category => {
          category.tags.forEach(tag => {
            tags.push({
              ...tag,
              category: category.title,
            });
          });
        });
        this.tags = tags;

        if (queryParams.tags) {
          this.selectedTagsName = Array.from(new Set(this.tags.filter(tag => queryParams.tags.indexOf(tag.id) !== -1).map(tag => tag.name))).join(', ');
        }
        this.cdr.detectChanges();
      }
    );

    this.filterForm.controls.tags.valueChanges.subscribe(
      (tags) => {
        this.selectedTagsName = Array.from(new Set(this.tags.filter(tag => tags.indexOf(tag.id) !== -1).map(tag => tag.name))).join(', ');
      }
    );

    this.service.getDifficulties().subscribe(
      (difficulties: any) => {
        this.difficulties = difficulties;
      }
    );
  }

  compareEqual(a, b) {
    return equalsCheck(a, b) || a?.toString() === b?.toString();
  }

  tagOnClick(tagId: number) {
    const tags = this.filterForm.value.tags || [];
    const index = tags.indexOf(tagId);
    if (index === -1) {
      tags.push(tagId);
    } else {
      tags.splice(index, 1);
    }
    this.filterForm.patchValue({tags: tags});
  }
}
