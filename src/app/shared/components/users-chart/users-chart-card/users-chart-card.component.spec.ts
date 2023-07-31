import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersChartCardComponent } from './users-chart-card.component';

describe('UsersChartCardComponent', () => {
  let component: UsersChartCardComponent;
  let fixture: ComponentFixture<UsersChartCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersChartCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersChartCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
