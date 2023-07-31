import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestAttemptsComponent } from './contest-attempts.component';

describe('ContestAttemptsComponent', () => {
  let component: ContestAttemptsComponent;
  let fixture: ComponentFixture<ContestAttemptsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestAttemptsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestAttemptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
