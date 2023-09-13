import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HackAttemptsComponent } from './hack-attempts.component';

describe('HackAttemptsComponent', () => {
  let component: HackAttemptsComponent;
  let fixture: ComponentFixture<HackAttemptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HackAttemptsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HackAttemptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
