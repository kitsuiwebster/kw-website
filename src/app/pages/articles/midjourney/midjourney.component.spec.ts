import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MidjourneyComponent } from './midjourney.component';

describe('MidjourneyComponent', () => {
  let component: MidjourneyComponent;
  let fixture: ComponentFixture<MidjourneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MidjourneyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MidjourneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
