import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KepcoinComponent } from './kepcoin.component';

describe('KepcoinComponent', () => {
  let component: KepcoinComponent;
  let fixture: ComponentFixture<KepcoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KepcoinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KepcoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
