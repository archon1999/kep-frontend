import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KepcoinViewComponent } from './kepcoin-view.component';

describe('KepcoinViewComponent', () => {
  let component: KepcoinViewComponent;
  let fixture: ComponentFixture<KepcoinViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KepcoinViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KepcoinViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
