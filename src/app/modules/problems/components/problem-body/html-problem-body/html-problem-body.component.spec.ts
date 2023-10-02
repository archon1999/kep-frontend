import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtmlProblemBodyComponent } from './html-problem-body.component';

describe('HtmlProblemBodyComponent', () => {
  let component: HtmlProblemBodyComponent;
  let fixture: ComponentFixture<HtmlProblemBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HtmlProblemBodyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HtmlProblemBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
