import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProblemSidebarInfoComponent } from './problem-sidebar-info.component';

describe('ProblemSidebarInfoComponent', () => {
  let component: ProblemSidebarInfoComponent;
  let fixture: ComponentFixture<ProblemSidebarInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProblemSidebarInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProblemSidebarInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
