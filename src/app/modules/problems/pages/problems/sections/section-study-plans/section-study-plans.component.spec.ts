import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionStudyPlansComponent } from './section-study-plans.component';

describe('SectionStudyPlansComponent', () => {
  let component: SectionStudyPlansComponent;
  let fixture: ComponentFixture<SectionStudyPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionStudyPlansComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionStudyPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
