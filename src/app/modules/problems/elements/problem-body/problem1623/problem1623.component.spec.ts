import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1623Component } from './problem1623.component';

describe('Problem1623Component', () => {
  let component: Problem1623Component;
  let fixture: ComponentFixture<Problem1623Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1623Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1623Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
