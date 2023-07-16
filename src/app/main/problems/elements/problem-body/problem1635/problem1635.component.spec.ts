import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1635Component } from './problem1635.component';

describe('Problem1635Component', () => {
  let component: Problem1635Component;
  let fixture: ComponentFixture<Problem1635Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1635Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1635Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
