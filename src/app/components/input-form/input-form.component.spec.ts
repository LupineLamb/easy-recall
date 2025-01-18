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

  it('should switch to passage mode when text is submitted', () => {
    spyOn(component, 'switchToPassageMode');
    component.inputText = "Dummy text";
    component.submitText(new Event(''));
    
    expect(component.switchToPassageMode).toHaveBeenCalledTimes(1);
  });

});
