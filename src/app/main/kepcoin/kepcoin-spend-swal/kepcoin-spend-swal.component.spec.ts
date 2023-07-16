import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KepcoinSpendSwalComponent } from './kepcoin-spend-swal.component';

describe('KepcoinSpendSwalComponent', () => {
  let component: KepcoinSpendSwalComponent;
  let fixture: ComponentFixture<KepcoinSpendSwalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KepcoinSpendSwalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KepcoinSpendSwalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
