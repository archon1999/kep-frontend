import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTimelineComponent } from './section-timeline.component';

describe('SectionTimelineComponent', () => {
  let component: SectionTimelineComponent;
  let fixture: ComponentFixture<SectionTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionTimelineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
