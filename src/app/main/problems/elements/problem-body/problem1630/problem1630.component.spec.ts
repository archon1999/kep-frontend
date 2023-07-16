import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1630Component } from './problem1630.component';

describe('Problem1630Component', () => {
  let component: Problem1630Component;
  let fixture: ComponentFixture<Problem1630Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1630Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1630Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
