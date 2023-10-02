import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1841Component } from './problem1841.component';

describe('Problem1841Component', () => {
  let component: Problem1841Component;
  let fixture: ComponentFixture<Problem1841Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1841Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1841Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
