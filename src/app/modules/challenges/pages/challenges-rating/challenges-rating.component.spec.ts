import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengesRatingComponent } from './challenges-rating.component';

describe('ChallengesRatingComponent', () => {
  let component: ChallengesRatingComponent;
  let fixture: ComponentFixture<ChallengesRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengesRatingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengesRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
