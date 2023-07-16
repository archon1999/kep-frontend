import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1737Component } from './problem1737.component';

describe('Problem1737Component', () => {
  let component: Problem1737Component;
  let fixture: ComponentFixture<Problem1737Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1737Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1737Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
