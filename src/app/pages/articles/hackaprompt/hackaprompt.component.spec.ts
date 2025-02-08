import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HackapromptComponent } from './hackaprompt.component';

describe('HackapromptComponent', () => {
  let component: HackapromptComponent;
  let fixture: ComponentFixture<HackapromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HackapromptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HackapromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
