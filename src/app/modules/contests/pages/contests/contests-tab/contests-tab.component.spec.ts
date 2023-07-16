import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestsTabComponent } from './contests-tab.component';

describe('ContestsTabComponent', () => {
  let component: ContestsTabComponent;
  let fixture: ComponentFixture<ContestsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestsTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
