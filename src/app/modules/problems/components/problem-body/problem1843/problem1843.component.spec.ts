import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1843Component } from './problem1843.component';

describe('Problem1843Component', () => {
  let component: Problem1843Component;
  let fixture: ComponentFixture<Problem1843Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1843Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1843Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
