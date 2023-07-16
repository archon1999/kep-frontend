import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartCommentsComponent } from './part-comments.component';

describe('PartCommentsComponent', () => {
  let component: PartCommentsComponent;
  let fixture: ComponentFixture<PartCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartCommentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
