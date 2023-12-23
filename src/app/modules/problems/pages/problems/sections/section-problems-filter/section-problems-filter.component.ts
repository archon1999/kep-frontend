import { Component, OnInit } from '@angular/core';
import { Category, ProblemsFilter, Tag } from '@problems/models/problems.models';
import { ProblemsApiService } from '@problems/services/problems-api.service';
import { ProblemsFilterService } from 'app/modules/problems/services/problems-filter.service';
import { BaseComponent } from '@shared/components/classes/base.component';
import { FormControl, FormGroup } from '@angular/forms';
import { equalsCheck } from '@shared/utils';
import { CoreCommonModule } from '@core/common.module';
import { ProblemsPipesModule } from '@problems/pipes/problems-pipes.module';
import { NgbAccordionModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { NgSelectModule } from '@shared/third-part-modules/ng-select/ng-select.module';

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
  ]
})
export class SectionProblemsFilterComponent extends BaseComponent implements OnInit {

  public filterForm = new FormGroup({
    title: new FormControl(),
    tags: new FormControl([]),
    difficulty: new FormControl(),
    status: new FormControl(),
    hasChecker: new FormControl(),
    hasCheckInput: new FormControl(),
    hasSolution: new FormControl(),
    partialSolvable: new FormControl(),
  });

  public tags: Array<Tag> = [];
  public categories: Array<Category> = [];
  public difficulties: Array<Difficulty> = [];

  public selectedTagsName: string;

  public filterCollapsed = false;

  constructor(
    public service: ProblemsApiService,
    public problemsFilterService: ProblemsFilterService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.filterForm.valueChanges.subscribe(
      (filterValue: ProblemsFilter) => {
        this.problemsFilterService.updateFilter(filterValue);
      }
    );

    this.service.getCategories().subscribe(
      (categories: Array<Category>) => {
        this.categories = categories;
        const tags = [];
        this.categories.forEach(category => {
          category.tags.forEach(tag => {
            tags.push({
              ...tag,
              category: category.title,
            });
          });
        });
        this.tags = tags;
      }
    );

    this.filterForm.controls.tags.valueChanges.subscribe(
      (tags) => {
        this.selectedTagsName = Array.from(new Set(this.tags.filter(tag => tags.indexOf(tag.id) !== -1).map(tag => tag.name))).join(', ');
      }
    );

    // this.service.getTags().subscribe(
    //   (tags: any) => {
    //     this.tags = tags;
    //   }
    // );

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
    this.filterForm.patchValue({ tags: tags });
  }
}
