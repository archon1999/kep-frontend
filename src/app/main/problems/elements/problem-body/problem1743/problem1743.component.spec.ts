import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1743Component } from './problem1743.component';

describe('Problem1743Component', () => {
  let component: Problem1743Component;
  let fixture: ComponentFixture<Problem1743Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1743Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1743Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
