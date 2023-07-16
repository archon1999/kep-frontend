import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideMainComponent } from './slide-main.component';

describe('SlideMainComponent', () => {
  let component: SlideMainComponent;
  let fixture: ComponentFixture<SlideMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlideMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
