import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ng2FlatpickrComponent } from './ng2-flatpickr.component';

describe('Ng2FlatpickrComponent', () => {
  let component: Ng2FlatpickrComponent;
  let fixture: ComponentFixture<Ng2FlatpickrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ng2FlatpickrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ng2FlatpickrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
