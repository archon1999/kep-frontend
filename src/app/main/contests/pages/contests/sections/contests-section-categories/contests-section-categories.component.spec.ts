import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestsSectionCategoriesComponent } from './contests-section-categories.component';

describe('ContestsSectionCategoriesComponent', () => {
  let component: ContestsSectionCategoriesComponent;
  let fixture: ComponentFixture<ContestsSectionCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestsSectionCategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestsSectionCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
