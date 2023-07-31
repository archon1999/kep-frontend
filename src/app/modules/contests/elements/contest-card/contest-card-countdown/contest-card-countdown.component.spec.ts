import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestCardCountdownComponent } from './contest-card-countdown.component';

describe('ContestCardCountdownComponent', () => {
  let component: ContestCardCountdownComponent;
  let fixture: ComponentFixture<ContestCardCountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestCardCountdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestCardCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
