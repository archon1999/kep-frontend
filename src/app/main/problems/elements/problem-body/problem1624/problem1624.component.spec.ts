import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1624Component } from './problem1624.component';

describe('Problem1624Component', () => {
  let component: Problem1624Component;
  let fixture: ComponentFixture<Problem1624Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1624Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1624Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
