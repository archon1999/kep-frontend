import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1736Component } from './problem1736.component';

describe('Problem1736Component', () => {
  let component: Problem1736Component;
  let fixture: ComponentFixture<Problem1736Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1736Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1736Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
