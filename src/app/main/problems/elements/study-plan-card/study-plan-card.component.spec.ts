import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyPlanCardComponent } from './study-plan-card.component';

describe('StudyPlanCardComponent', () => {
  let component: StudyPlanCardComponent;
  let fixture: ComponentFixture<StudyPlanCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudyPlanCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyPlanCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
