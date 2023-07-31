import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionHeatmapComponent } from './section-heatmap.component';

describe('SectionHeatmapComponent', () => {
  let component: SectionHeatmapComponent;
  let fixture: ComponentFixture<SectionHeatmapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionHeatmapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionHeatmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
