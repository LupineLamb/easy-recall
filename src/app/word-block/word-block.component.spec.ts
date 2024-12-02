import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordBlockComponent } from './word-block.component';

describe('WordBlockComponent', () => {
  let component: WordBlockComponent;
  let fixture: ComponentFixture<WordBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
