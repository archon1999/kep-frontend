import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1842Component } from './problem1842.component';

describe('Problem1842Component', () => {
  let component: Problem1842Component;
  let fixture: ComponentFixture<Problem1842Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1842Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1842Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
