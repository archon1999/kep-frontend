import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoderRushCountdownComponent } from './coder-rush-countdown.component';

describe('DuelCountdownComponent', () => {
  let component: CoderRushCountdownComponent;
  let fixture: ComponentFixture<CoderRushCountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoderRushCountdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoderRushCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
