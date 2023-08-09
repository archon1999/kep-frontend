import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1628Component } from './problem1628.component';

describe('Problem1628Component', () => {
  let component: Problem1628Component;
  let fixture: ComponentFixture<Problem1628Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1628Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1628Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
