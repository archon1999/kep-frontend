import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestsSectionComponent } from './contests-section.component';

describe('ContestsSectionComponent', () => {
  let component: ContestsSectionComponent;
  let fixture: ComponentFixture<ContestsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestsSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
