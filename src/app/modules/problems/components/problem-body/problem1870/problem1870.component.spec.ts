import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1870Component } from './problem1870.component';

describe('Problem1870Component', () => {
  let component: Problem1870Component;
  let fixture: ComponentFixture<Problem1870Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1870Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1870Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
