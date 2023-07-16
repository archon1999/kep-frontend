import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersSelectComponent } from './users-select.component';

describe('UsersSelectComponent', () => {
  let component: UsersSelectComponent;
  let fixture: ComponentFixture<UsersSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
