import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarDailyTasksComponent } from './navbar-daily-tasks.component';

describe('NavbarDailyTasksComponent', () => {
  let component: NavbarDailyTasksComponent;
  let fixture: ComponentFixture<NavbarDailyTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarDailyTasksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarDailyTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
