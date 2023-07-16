import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideContestsComponent } from './slide-contests.component';

describe('SlideContestsComponent', () => {
  let component: SlideContestsComponent;
  let fixture: ComponentFixture<SlideContestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideContestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideContestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
