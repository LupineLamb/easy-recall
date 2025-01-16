import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordBlockComponent } from './components/word-block/word-block.component';
import { InputFormComponent } from "./components/input-form/input-form.component";
import { GradingModeComponent } from "./components/grading-mode/grading-mode.component";
import { CurrentMode } from './enums/current-mode';

@Component({
  selector: 'app-root',
  imports: [CommonModule, WordBlockComponent, InputFormComponent, GradingModeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'easy-recall';
  CurrentModeHTML = CurrentMode
  currentMode = CurrentMode.INPUT
  handleModeSwitch(newMode: CurrentMode) {
    this.currentMode = newMode
    }
}
