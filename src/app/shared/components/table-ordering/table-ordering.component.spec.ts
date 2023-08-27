import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableOrderingComponent } from './table-ordering.component';

describe('TableOrderingComponent', () => {
  let component: TableOrderingComponent;
  let fixture: ComponentFixture<TableOrderingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableOrderingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableOrderingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
