import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAvatarPopoverComponent } from './user-avatar-popover.component';

describe('UserAvatarPopoverComponent', () => {
  let component: UserAvatarPopoverComponent;
  let fixture: ComponentFixture<UserAvatarPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserAvatarPopoverComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserAvatarPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
