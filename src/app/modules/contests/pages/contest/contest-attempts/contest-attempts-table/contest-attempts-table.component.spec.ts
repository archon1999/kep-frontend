import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestAttemptsTableComponent } from './contest-attempts-table.component';

describe('ContestAttemptsTableComponent', () => {
  let component: ContestAttemptsTableComponent;
  let fixture: ComponentFixture<ContestAttemptsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestAttemptsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestAttemptsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
