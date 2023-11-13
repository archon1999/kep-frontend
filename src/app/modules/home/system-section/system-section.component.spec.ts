import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSectionComponent } from './system-section.component';

describe('SystemSectionComponent', () => {
  let component: SystemSectionComponent;
  let fixture: ComponentFixture<SystemSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SystemSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
