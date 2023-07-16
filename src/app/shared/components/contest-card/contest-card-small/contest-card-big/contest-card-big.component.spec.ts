import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestCardBigComponent } from './contest-card-big.component';

describe('ContestCardBigComponent', () => {
  let component: ContestCardBigComponent;
  let fixture: ComponentFixture<ContestCardBigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestCardBigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestCardBigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
