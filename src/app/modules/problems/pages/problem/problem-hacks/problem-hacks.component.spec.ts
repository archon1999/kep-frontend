import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemHacksComponent } from './problem-hacks.component';

describe('ProblemHacksComponent', () => {
  let component: ProblemHacksComponent;
  let fixture: ComponentFixture<ProblemHacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemHacksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemHacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
