import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuelCountdownComponent } from './duel-countdown.component';

describe('DuelCountdownComponent', () => {
  let component: DuelCountdownComponent;
  let fixture: ComponentFixture<DuelCountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DuelCountdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuelCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
