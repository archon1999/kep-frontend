import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideLearnComponent } from './slide-learn.component';

describe('SlideLearnComponent', () => {
  let component: SlideLearnComponent;
  let fixture: ComponentFixture<SlideLearnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideLearnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideLearnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
