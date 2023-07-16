import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1744Component } from './problem1744.component';

describe('Problem1744Component', () => {
  let component: Problem1744Component;
  let fixture: ComponentFixture<Problem1744Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1744Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1744Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
