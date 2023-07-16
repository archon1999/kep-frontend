import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttemptsTableComponent } from './attempts-table.component';

describe('AttemptsTableComponent', () => {
  let component: AttemptsTableComponent;
  let fixture: ComponentFixture<AttemptsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttemptsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttemptsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
