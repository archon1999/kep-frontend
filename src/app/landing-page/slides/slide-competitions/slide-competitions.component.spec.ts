import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideCompetitionsComponent } from './slide-competitions.component';

describe('SlideCompetitionsComponent', () => {
  let component: SlideCompetitionsComponent;
  let fixture: ComponentFixture<SlideCompetitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideCompetitionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideCompetitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
