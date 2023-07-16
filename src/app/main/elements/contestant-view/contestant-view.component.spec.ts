import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestantViewComponent } from './contestant-view.component';

describe('ContestantViewComponent', () => {
  let component: ContestantViewComponent;
  let fixture: ComponentFixture<ContestantViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestantViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestantViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
