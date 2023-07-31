import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentListCardComponent } from './tournament-list-card.component';

describe('TournamentListCardComponent', () => {
  let component: TournamentListCardComponent;
  let fixture: ComponentFixture<TournamentListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentListCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TournamentListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
