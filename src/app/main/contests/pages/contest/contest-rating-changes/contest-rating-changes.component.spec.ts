import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestRatingChangesComponent } from './contest-rating-changes.component';

describe('ContestRatingChangesComponent', () => {
  let component: ContestRatingChangesComponent;
  let fixture: ComponentFixture<ContestRatingChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestRatingChangesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestRatingChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
