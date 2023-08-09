import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1741Component } from './problem1741.component';

describe('Problem1741Component', () => {
  let component: Problem1741Component;
  let fixture: ComponentFixture<Problem1741Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1741Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1741Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
