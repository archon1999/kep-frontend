import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentVersusComponent } from './tournament-versus.component';

describe('TournamentVersusComponent', () => {
  let component: TournamentVersusComponent;
  let fixture: ComponentFixture<TournamentVersusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentVersusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentVersusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
