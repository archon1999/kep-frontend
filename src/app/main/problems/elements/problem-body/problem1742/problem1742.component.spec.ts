import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1742Component } from './problem1742.component';

describe('Problem1742Component', () => {
  let component: Problem1742Component;
  let fixture: ComponentFixture<Problem1742Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1742Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1742Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
