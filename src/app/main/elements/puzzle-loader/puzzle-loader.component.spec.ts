import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuzzleLoaderComponent } from './puzzle-loader.component';

describe('PuzzleLoaderComponent', () => {
  let component: PuzzleLoaderComponent;
  let fixture: ComponentFixture<PuzzleLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuzzleLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuzzleLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
