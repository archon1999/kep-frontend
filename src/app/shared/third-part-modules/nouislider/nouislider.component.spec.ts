import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouisliderComponent } from './nouislider.component';

describe('NouisliderComponent', () => {
  let component: NouisliderComponent;
  let fixture: ComponentFixture<NouisliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouisliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouisliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
