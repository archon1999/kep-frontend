import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemDiscussionComponent } from './problem-discussion.component';

describe('ProblemDiscussionComponent', () => {
  let component: ProblemDiscussionComponent;
  let fixture: ComponentFixture<ProblemDiscussionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemDiscussionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
