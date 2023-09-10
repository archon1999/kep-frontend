import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestProblemCardComponent } from './contest-problem-card.component';

describe('ContestProblemCardComponent', () => {
  let component: ContestProblemCardComponent;
  let fixture: ComponentFixture<ContestProblemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestProblemCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestProblemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
