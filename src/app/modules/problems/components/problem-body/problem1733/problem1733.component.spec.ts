import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1733Component } from './problem1733.component';

describe('Problem1733Component', () => {
  let component: Problem1733Component;
  let fixture: ComponentFixture<Problem1733Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1733Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1733Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
