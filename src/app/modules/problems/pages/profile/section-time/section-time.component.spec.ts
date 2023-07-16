import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionTimeComponent } from './section-time.component';

describe('SectionTimeComponent', () => {
  let component: SectionTimeComponent;
  let fixture: ComponentFixture<SectionTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionTimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
