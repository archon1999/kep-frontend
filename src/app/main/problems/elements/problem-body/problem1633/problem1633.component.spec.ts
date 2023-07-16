import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1633Component } from './problem1633.component';

describe('Problem1633Component', () => {
  let component: Problem1633Component;
  let fixture: ComponentFixture<Problem1633Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1633Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1633Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
