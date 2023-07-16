import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1703Component } from './problem1703.component';

describe('Problem1703Component', () => {
  let component: Problem1703Component;
  let fixture: ComponentFixture<Problem1703Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1703Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1703Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
