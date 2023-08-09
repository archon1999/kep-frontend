import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemBodyComponent } from './problem-body.component';

describe('ProblemBodyComponent', () => {
  let component: ProblemBodyComponent;
  let fixture: ComponentFixture<ProblemBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemBodyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
