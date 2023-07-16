import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestStandingsComponent } from './contest-standings.component';

describe('ContestStandingsComponent', () => {
  let component: ContestStandingsComponent;
  let fixture: ComponentFixture<ContestStandingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestStandingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestStandingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
