import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestListCardComponent } from './test-list-card.component';

describe('TestListCardComponent', () => {
  let component: TestListCardComponent;
  let fixture: ComponentFixture<TestListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestListCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
