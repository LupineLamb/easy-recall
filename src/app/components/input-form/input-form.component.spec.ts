import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFormComponent } from './input-form.component';

describe('InputFormComponent', () => {
  let component: InputFormComponent;
  let fixture: ComponentFixture<InputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process input text into lines and words', () => {
    component.inputText = "Two words";
    component.submitText(new Event(''));
    expect(component.allWords.length).toBe(2);
    expect(component.allWords[0].beginsLine).toBe(true);
    expect(component.allWords[1].beginsLine).toBe(false);

    component.inputText = "Two\nlines";
    component.submitText(new Event(''));
    expect(component.allWords.length).toBe(2);
    expect(component.allWords[0].beginsLine).toBe(true);
    expect(component.allWords[1].beginsLine).toBe(true);

    component.inputText = "Two\nlines, four words";
    component.submitText(new Event(''));
    expect(component.allWords.length).toBe(4);
    expect(component.allWords[0].beginsLine).toBe(true);
    expect(component.allWords[1].beginsLine).toBe(true);
    expect(component.allWords[2].beginsLine).toBe(false);
    expect(component.allWords[3].beginsLine).toBe(false);
  });

  it('should switch to passage mode when text is submitted', () => {
    spyOn(component, 'switchToPassageMode');
    component.inputText = "Dummy text";
    component.submitText(new Event(''));
    
    expect(component.switchToPassageMode).toHaveBeenCalledTimes(1);
  });

});
