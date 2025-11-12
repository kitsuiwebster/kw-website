import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CozybotComponent } from './cozybot.component';

describe('CozybotComponent', () => {
  let component: CozybotComponent;
  let fixture: ComponentFixture<CozybotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CozybotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CozybotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});