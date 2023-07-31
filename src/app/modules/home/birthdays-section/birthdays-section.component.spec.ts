import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BirthdaysSectionComponent } from './birthdays-section.component';

describe('BirthdaysSectionComponent', () => {
  let component: BirthdaysSectionComponent;
  let fixture: ComponentFixture<BirthdaysSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BirthdaysSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BirthdaysSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
