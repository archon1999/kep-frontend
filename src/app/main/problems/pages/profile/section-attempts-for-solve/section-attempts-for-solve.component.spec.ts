import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionAttemptsForSolveComponent } from './section-attempts-for-solve.component';

describe('SectionAttemptsForSolveComponent', () => {
  let component: SectionAttemptsForSolveComponent;
  let fixture: ComponentFixture<SectionAttemptsForSolveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionAttemptsForSolveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionAttemptsForSolveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
