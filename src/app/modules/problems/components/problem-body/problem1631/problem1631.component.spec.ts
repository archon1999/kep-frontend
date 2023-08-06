import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1631Component } from './problem1631.component';

describe('Problem1631Component', () => {
  let component: Problem1631Component;
  let fixture: ComponentFixture<Problem1631Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1631Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1631Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
