import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestProblemInfoComponent } from './contest-problem-info.component';

describe('ContestProblemInfoComponent', () => {
  let component: ContestProblemInfoComponent;
  let fixture: ComponentFixture<ContestProblemInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestProblemInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestProblemInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
