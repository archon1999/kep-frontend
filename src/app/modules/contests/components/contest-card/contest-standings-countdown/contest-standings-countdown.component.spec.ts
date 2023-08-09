import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestStandingsCountdownComponent } from './contest-standings-countdown.component';

describe('ContestStandingsCountdownComponent', () => {
  let component: ContestStandingsCountdownComponent;
  let fixture: ComponentFixture<ContestStandingsCountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestStandingsCountdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestStandingsCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
