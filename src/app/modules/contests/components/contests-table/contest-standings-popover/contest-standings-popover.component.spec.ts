import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestStandingsPopoverComponent } from './contest-standings-popover.component';

describe('ContestStandingsPopoverComponent', () => {
  let component: ContestStandingsPopoverComponent;
  let fixture: ComponentFixture<ContestStandingsPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestStandingsPopoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestStandingsPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
