import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemListCardComponent } from './problem-list-card.component';

describe('ProblemListCardComponent', () => {
  let component: ProblemListCardComponent;
  let fixture: ComponentFixture<ProblemListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemListCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
