import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestTabComponent } from './contest-tab.component';

describe('ContestTabComponent', () => {
  let component: ContestTabComponent;
  let fixture: ComponentFixture<ContestTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
