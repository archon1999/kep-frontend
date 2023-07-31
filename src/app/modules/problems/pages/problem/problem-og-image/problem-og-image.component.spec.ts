import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemOgImageComponent } from './problem-og-image.component';

describe('ProblemOgImageComponent', () => {
  let component: ProblemOgImageComponent;
  let fixture: ComponentFixture<ProblemOgImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemOgImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemOgImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
