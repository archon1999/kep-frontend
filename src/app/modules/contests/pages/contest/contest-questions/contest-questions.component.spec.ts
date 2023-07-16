import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestQuestionsComponent } from './contest-questions.component';

describe('ContestQuestionsComponent', () => {
  let component: ContestQuestionsComponent;
  let fixture: ComponentFixture<ContestQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestQuestionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
