import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CpythonCupComponent } from './cpython-cup.component';

describe('CpythonCupComponent', () => {
  let component: CpythonCupComponent;
  let fixture: ComponentFixture<CpythonCupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CpythonCupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CpythonCupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
