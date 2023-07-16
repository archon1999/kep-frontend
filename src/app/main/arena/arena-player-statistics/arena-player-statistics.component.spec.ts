import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaPlayerStatisticsComponent } from './arena-player-statistics.component';

describe('ArenaPlayerStatisticsComponent', () => {
  let component: ArenaPlayerStatisticsComponent;
  let fixture: ComponentFixture<ArenaPlayerStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArenaPlayerStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArenaPlayerStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
