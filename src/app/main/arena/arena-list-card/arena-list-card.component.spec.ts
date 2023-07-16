import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArenaListCardComponent } from './arena-list-card.component';

describe('ArenaListCardComponent', () => {
  let component: ArenaListCardComponent;
  let fixture: ComponentFixture<ArenaListCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArenaListCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArenaListCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
