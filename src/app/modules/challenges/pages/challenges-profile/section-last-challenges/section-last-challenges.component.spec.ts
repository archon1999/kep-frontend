import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionLastChallengesComponent } from './section-last-challenges.component';

describe('SectionLastChallengesComponent', () => {
  let component: SectionLastChallengesComponent;
  let fixture: ComponentFixture<SectionLastChallengesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionLastChallengesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionLastChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
