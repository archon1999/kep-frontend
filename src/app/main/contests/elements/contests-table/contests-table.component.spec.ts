import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestsTableComponent } from './contests-table.component';

describe('ContestsTableComponent', () => {
  let component: ContestsTableComponent;
  let fixture: ComponentFixture<ContestsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
