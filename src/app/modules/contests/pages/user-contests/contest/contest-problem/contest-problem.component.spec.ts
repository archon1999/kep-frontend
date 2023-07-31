import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestProblemComponent } from './contest-problem.component';

describe('ContestProblemComponent', () => {
  let component: ContestProblemComponent;
  let fixture: ComponentFixture<ContestProblemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestProblemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
