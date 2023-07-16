import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestCardSmallComponent } from './contest-card-small.component';

describe('ContestCardSmallComponent', () => {
  let component: ContestCardSmallComponent;
  let fixture: ComponentFixture<ContestCardSmallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestCardSmallComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestCardSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
