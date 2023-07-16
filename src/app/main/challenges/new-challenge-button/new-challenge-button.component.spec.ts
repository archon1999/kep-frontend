import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChallengeButtonComponent } from './new-challenge-button.component';

describe('NewChallengeButtonComponent', () => {
  let component: NewChallengeButtonComponent;
  let fixture: ComponentFixture<NewChallengeButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewChallengeButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewChallengeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
