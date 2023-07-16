import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Problem1735Component } from './problem1735.component';

describe('Problem1735Component', () => {
  let component: Problem1735Component;
  let fixture: ComponentFixture<Problem1735Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Problem1735Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Problem1735Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
