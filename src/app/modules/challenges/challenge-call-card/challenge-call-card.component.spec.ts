import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeCallCardComponent } from './challenge-call-card.component';

describe('ChallengeCallCardComponent', () => {
  let component: ChallengeCallCardComponent;
  let fixture: ComponentFixture<ChallengeCallCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeCallCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeCallCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
