import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeRushComponent } from './code-rush.component';

describe('DuelComponent', () => {
  let component: CodeRushComponent;
  let fixture: ComponentFixture<CodeRushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeRushComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeRushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
