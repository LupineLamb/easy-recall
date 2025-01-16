import { Component, EventEmitter, Output } from '@angular/core';
import { CurrentMode } from '../../enums/current-mode';

@Component({
  selector: 'app-grading-mode',
  standalone: true,
  imports: [],
  templateUrl: './grading-mode.component.html',
  styleUrl: './grading-mode.component.css'
})
export class GradingModeComponent {
  @Output() switchMode = new EventEmitter<CurrentMode>();

  switchToInputMode(): void {
    this.switchMode.emit(CurrentMode.INPUT)
  }

}
