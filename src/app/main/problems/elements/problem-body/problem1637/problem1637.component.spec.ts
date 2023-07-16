import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1637Component } from './problem1637.component';

describe('Problem1637Component', () => {
  let component: Problem1637Component;
  let fixture: ComponentFixture<Problem1637Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1637Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1637Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
