import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1615Component } from './problem1615.component';

describe('Problem1615Component', () => {
  let component: Problem1615Component;
  let fixture: ComponentFixture<Problem1615Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1615Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1615Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
