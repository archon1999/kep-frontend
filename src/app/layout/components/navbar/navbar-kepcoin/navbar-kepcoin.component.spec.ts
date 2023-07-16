import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarKepcoinComponent } from './navbar-kepcoin.component';

describe('NavbarKepcoinComponent', () => {
  let component: NavbarKepcoinComponent;
  let fixture: ComponentFixture<NavbarKepcoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarKepcoinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarKepcoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
