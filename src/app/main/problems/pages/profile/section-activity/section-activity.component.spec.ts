import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionActivityComponent } from './section-activity.component';

describe('SectionActivityComponent', () => {
  let component: SectionActivityComponent;
  let fixture: ComponentFixture<SectionActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionActivityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
