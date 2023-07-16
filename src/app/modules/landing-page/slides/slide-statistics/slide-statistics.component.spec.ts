import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideStatisticsComponent } from './slide-statistics.component';

describe('SlideStatisticsComponent', () => {
  let component: SlideStatisticsComponent;
  let fixture: ComponentFixture<SlideStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
