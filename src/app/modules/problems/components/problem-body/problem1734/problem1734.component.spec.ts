import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1734Component } from './problem1734.component';

describe('Problem1734Component', () => {
  let component: Problem1734Component;
  let fixture: ComponentFixture<Problem1734Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1734Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1734Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
