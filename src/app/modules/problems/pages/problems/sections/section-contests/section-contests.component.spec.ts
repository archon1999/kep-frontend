import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionContestsComponent } from './section-contests.component';

describe('SectionContestsComponent', () => {
  let component: SectionContestsComponent;
  let fixture: ComponentFixture<SectionContestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionContestsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionContestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
