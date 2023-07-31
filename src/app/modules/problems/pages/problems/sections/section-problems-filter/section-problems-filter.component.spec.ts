import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionProblemsFilterComponent } from './section-problems-filter.component';

describe('SectionProblemsFilterComponent', () => {
  let component: SectionProblemsFilterComponent;
  let fixture: ComponentFixture<SectionProblemsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionProblemsFilterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionProblemsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
