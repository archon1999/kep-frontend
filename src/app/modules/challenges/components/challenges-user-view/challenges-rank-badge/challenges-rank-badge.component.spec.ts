import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengesRankBadgeComponent } from './challenges-rank-badge.component';

describe('ChallengesRankBadgeComponent', () => {
  let component: ChallengesRankBadgeComponent;
  let fixture: ComponentFixture<ChallengesRankBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengesRankBadgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengesRankBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
