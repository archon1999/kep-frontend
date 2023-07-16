import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LugavarComponent } from './lugavar.component';

describe('LugavarComponent', () => {
  let component: LugavarComponent;
  let fixture: ComponentFixture<LugavarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LugavarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LugavarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
