import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1638Component } from './problem1638.component';

describe('Problem1638Component', () => {
  let component: Problem1638Component;
  let fixture: ComponentFixture<Problem1638Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1638Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1638Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
