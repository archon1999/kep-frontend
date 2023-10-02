import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionRatingChangesComponent } from './section-rating-changes.component';

describe('SectionRatingChangesComponent', () => {
  let component: SectionRatingChangesComponent;
  let fixture: ComponentFixture<SectionRatingChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionRatingChangesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionRatingChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
