import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestOgImageComponent } from './contest-og-image.component';

describe('ContestOgImageComponent', () => {
  let component: ContestOgImageComponent;
  let fixture: ComponentFixture<ContestOgImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContestOgImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContestOgImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
