import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1739Component } from './problem1739.component';

describe('Problem1739Component', () => {
  let component: Problem1739Component;
  let fixture: ComponentFixture<Problem1739Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1739Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1739Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
