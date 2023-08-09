import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1639Component } from './problem1639.component';

describe('Problem1639Component', () => {
  let component: Problem1639Component;
  let fixture: ComponentFixture<Problem1639Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1639Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1639Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
