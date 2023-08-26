import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemSidebarStatisticsComponent } from './problem-sidebar-statistics.component';

describe('ProblemSidebarStatisticsComponent', () => {
  let component: ProblemSidebarStatisticsComponent;
  let fixture: ComponentFixture<ProblemSidebarStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemSidebarStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemSidebarStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
