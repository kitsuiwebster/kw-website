import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperproofComponent } from './paperproof.component';

describe('PaperproofComponent', () => {
  let component: PaperproofComponent;
  let fixture: ComponentFixture<PaperproofComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperproofComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperproofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
