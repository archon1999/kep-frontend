import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionDifficultiesComponent } from './section-difficulties.component';

describe('SectionDifficultiesComponent', () => {
  let component: SectionDifficultiesComponent;
  let fixture: ComponentFixture<SectionDifficultiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionDifficultiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionDifficultiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
