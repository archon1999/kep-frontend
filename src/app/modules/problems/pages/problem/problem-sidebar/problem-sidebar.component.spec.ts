import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemSidebarComponent } from './problem-sidebar.component';

describe('ProblemSidebarComponent', () => {
  let component: ProblemSidebarComponent;
  let fixture: ComponentFixture<ProblemSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemSidebarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
