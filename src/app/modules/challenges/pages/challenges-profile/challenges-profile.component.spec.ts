import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengesProfileComponent } from './challenges-profile.component';

describe('ChallengesProfileComponent', () => {
  let component: ChallengesProfileComponent;
  let fixture: ComponentFixture<ChallengesProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengesProfileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengesProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
