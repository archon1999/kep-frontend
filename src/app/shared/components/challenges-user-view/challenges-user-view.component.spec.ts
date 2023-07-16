import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengesUserViewComponent } from './challenges-user-view.component';

describe('ChallengesUserViewComponent', () => {
  let component: ChallengesUserViewComponent;
  let fixture: ComponentFixture<ChallengesUserViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengesUserViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChallengesUserViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
