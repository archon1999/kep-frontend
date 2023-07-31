import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaTournamentComponent } from './arena-tournament.component';

describe('ArenaTournamentComponent', () => {
  let component: ArenaTournamentComponent;
  let fixture: ComponentFixture<ArenaTournamentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArenaTournamentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArenaTournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
