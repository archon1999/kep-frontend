import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidePracticeComponent } from './slide-practice.component';

describe('SlidePracticeComponent', () => {
  let component: SlidePracticeComponent;
  let fixture: ComponentFixture<SlidePracticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlidePracticeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlidePracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
