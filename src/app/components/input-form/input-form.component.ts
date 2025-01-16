import { Component, EventEmitter, Output } from '@angular/core';
import { CurrentMode } from '../../enums/current-mode';

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.css'
})
export class InputFormComponent {
  @Output() switchMode = new EventEmitter<CurrentMode>();
  
    switchToPassageMode(): void {
      this.switchMode.emit(CurrentMode.PASSAGE)
    }
}
