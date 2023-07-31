import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsSectionComponent } from './statistics-section.component';

describe('StatisticsSectionComponent', () => {
  let component: StatisticsSectionComponent;
  let fixture: ComponentFixture<StatisticsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticsSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatisticsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
