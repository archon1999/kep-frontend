import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestsRatingImageComponent } from './contests-rating-image.component';

describe('ContestsRatingImageComponent', () => {
  let component: ContestsRatingImageComponent;
  let fixture: ComponentFixture<ContestsRatingImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestsRatingImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestsRatingImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
