import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseBestParticipantsComponent } from './course-best-participants.component';

describe('CourseBestParticipantsComponent', () => {
  let component: CourseBestParticipantsComponent;
  let fixture: ComponentFixture<CourseBestParticipantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseBestParticipantsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseBestParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
