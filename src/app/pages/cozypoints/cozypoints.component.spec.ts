import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CozypointsComponent } from './cozypoints.component';

describe('CozypointsComponent', () => {
  let component: CozypointsComponent;
  let fixture: ComponentFixture<CozypointsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CozypointsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CozypointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});