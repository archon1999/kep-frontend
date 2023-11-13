import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRatingSectionComponent } from './top-rating-section.component';

describe('TopRatingSectionComponent', () => {
  let component: TopRatingSectionComponent;
  let fixture: ComponentFixture<TopRatingSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopRatingSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopRatingSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
