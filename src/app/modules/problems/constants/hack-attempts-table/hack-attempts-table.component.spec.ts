import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HackAttemptsTableComponent } from './hack-attempts-table.component';

describe('AttemptsTableComponent', () => {
  let component: HackAttemptsTableComponent;
  let fixture: ComponentFixture<HackAttemptsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HackAttemptsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HackAttemptsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
