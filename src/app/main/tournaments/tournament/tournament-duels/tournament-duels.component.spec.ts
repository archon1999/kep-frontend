import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentDuelsComponent } from './tournament-duels.component';

describe('TournamentDuelsComponent', () => {
  let component: TournamentDuelsComponent;
  let fixture: ComponentFixture<TournamentDuelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentDuelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentDuelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
