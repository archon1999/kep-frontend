import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemSidebarTopAttemptsComponent } from './problem-sidebar-top-attempts.component';

describe('ProblemSidebarTopAttemptsComponent', () => {
  let component: ProblemSidebarTopAttemptsComponent;
  let fixture: ComponentFixture<ProblemSidebarTopAttemptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemSidebarTopAttemptsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemSidebarTopAttemptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
