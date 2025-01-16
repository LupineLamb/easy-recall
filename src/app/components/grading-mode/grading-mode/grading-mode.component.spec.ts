import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradingModeComponent } from './grading-mode.component';

describe('GradingModeComponent', () => {
  let component: GradingModeComponent;
  let fixture: ComponentFixture<GradingModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradingModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradingModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
