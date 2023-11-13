import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsSectionComponent } from './posts-section.component';

describe('PostsSectionComponent', () => {
  let component: PostsSectionComponent;
  let fixture: ComponentFixture<PostsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
