import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAttemptsComponent } from './project-attempts.component';

describe('ProjectAttemptsComponent', () => {
  let component: ProjectAttemptsComponent;
  let fixture: ComponentFixture<ProjectAttemptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectAttemptsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectAttemptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
