import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnoIconComponent } from './techno-icon.component';

describe('TechnoIconComponent', () => {
  let component: TechnoIconComponent;
  let fixture: ComponentFixture<TechnoIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnoIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnoIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
