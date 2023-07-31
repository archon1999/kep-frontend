import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionProblemsTableComponent } from './section-problems-table.component';

describe('SectionProblemsTableComponent', () => {
  let component: SectionProblemsTableComponent;
  let fixture: ComponentFixture<SectionProblemsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionProblemsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionProblemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
