import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1740Component } from './problem1740.component';

describe('Problem1740Component', () => {
  let component: Problem1740Component;
  let fixture: ComponentFixture<Problem1740Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1740Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1740Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
