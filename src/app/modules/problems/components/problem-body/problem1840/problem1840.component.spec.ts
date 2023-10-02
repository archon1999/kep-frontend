import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1840Component } from './problem1840.component';

describe('Problem1840Component', () => {
  let component: Problem1840Component;
  let fixture: ComponentFixture<Problem1840Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1840Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1840Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
