import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestCountdownComponent } from './contest-countdown.component';

describe('ContestCountdownComponent', () => {
  let component: ContestCountdownComponent;
  let fixture: ComponentFixture<ContestCountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestCountdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
