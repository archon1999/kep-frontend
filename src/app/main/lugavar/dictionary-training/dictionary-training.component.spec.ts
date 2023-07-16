import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionaryTrainingComponent } from './dictionary-training.component';

describe('DictionaryTrainingComponent', () => {
  let component: DictionaryTrainingComponent;
  let fixture: ComponentFixture<DictionaryTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DictionaryTrainingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DictionaryTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
