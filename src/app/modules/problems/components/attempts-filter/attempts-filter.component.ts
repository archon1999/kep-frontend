import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { KepIconComponent } from '@shared/components/kep-icon/kep-icon.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  VerdictsSelectComponent
} from '@problems/components/attempts-filter/verdicts-select/verdicts-select.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BaseUserComponent } from '@app/common';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { AttemptsFilter } from '@problems/interfaces';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { KepCardComponent } from "@shared/components/kep-card/kep-card.component";

@Component({
  selector: 'attempts-filter',
  standalone: true,
  imports: [
    KepIconComponent,
    TranslateModule,
    VerdictsSelectComponent,
    ReactiveFormsModule,
    NgbTooltipModule,
    KepCardComponent
  ],
  templateUrl: './attempts-filter.component.html',
  styleUrl: './attempts-filter.component.scss'
})
export class AttemptsFilterComponent extends BaseUserComponent implements OnInit {
  @Output() filterChange = new EventEmitter<AttemptsFilter>;

  public form = new FormGroup({
    username: new FormControl(),
    problemId: new FormControl(),
    verdict: new FormControl(),
  });

  ngOnInit() {
    this.form.valueChanges.pipe(
      debounceTime(500),
      takeUntil(this._unsubscribeAll)
    ).subscribe(
      (value) => {
        this.filterChange.next(value as AttemptsFilter);
      }
    );
  }

  myAttemptsClick() {
    this.form.controls.username.patchValue(this.currentUser?.username);
  }

  filterClear() {
    this.form.patchValue({
      username: null,
      problemId: null,
      verdict: null,
    });
  }
}
