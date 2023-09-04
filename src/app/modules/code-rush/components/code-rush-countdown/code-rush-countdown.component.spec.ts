import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeRushCountdownComponent } from './code-rush-countdown.component';

describe('DuelCountdownComponent', () => {
  let component: CodeRushCountdownComponent;
  let fixture: ComponentFixture<CodeRushCountdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeRushCountdownComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeRushCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
