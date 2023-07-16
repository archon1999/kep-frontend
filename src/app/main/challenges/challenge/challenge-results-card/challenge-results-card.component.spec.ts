import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeResultsCardComponent } from './challenge-results-card.component';

describe('ChallengeResultsCardComponent', () => {
  let component: ChallengeResultsCardComponent;
  let fixture: ComponentFixture<ChallengeResultsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeResultsCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengeResultsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
