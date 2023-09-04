import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeRushResultsTableComponent } from './code-rush-results-table.component';

describe('CodeRushResultsTableComponent', () => {
  let component: CodeRushResultsTableComponent;
  let fixture: ComponentFixture<CodeRushResultsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeRushResultsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeRushResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
