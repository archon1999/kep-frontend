import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemCardComponent } from './problem-card.component';

describe('ProblemCardComponent', () => {
  let component: ProblemCardComponent;
  let fixture: ComponentFixture<ProblemCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
