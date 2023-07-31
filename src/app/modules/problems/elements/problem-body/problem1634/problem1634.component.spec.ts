import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1634Component } from './problem1634.component';

describe('Problem1634Component', () => {
  let component: Problem1634Component;
  let fixture: ComponentFixture<Problem1634Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1634Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1634Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
