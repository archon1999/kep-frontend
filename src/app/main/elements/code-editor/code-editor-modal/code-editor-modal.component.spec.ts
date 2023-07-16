import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeEditorModalComponent } from './code-editor-modal.component';

describe('CodeEditorModalComponent', () => {
  let component: CodeEditorModalComponent;
  let fixture: ComponentFixture<CodeEditorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeEditorModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeEditorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
