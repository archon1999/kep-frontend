import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemInfoCardComponent } from './problem-info-card.component';

describe('ProblemInfoCardComponent', () => {
  let component: ProblemInfoCardComponent;
  let fixture: ComponentFixture<ProblemInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProblemInfoCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProblemInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
