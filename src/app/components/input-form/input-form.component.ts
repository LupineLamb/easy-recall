import { Component, EventEmitter, Output } from '@angular/core';
import { CurrentMode } from '../../enums/current-mode';
import { WordState } from '../../interfaces/word-state';
import { FormsModule } from '@angular/forms';
import { LocalDataService } from '../../services/local-data.service';
import { WordDataService } from '../../services/word-data/word-data.service';

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.css'
})
export class InputFormComponent {
  @Output() switchMode = new EventEmitter<CurrentMode>();
  switchToPassageMode(): void {
    this.switchMode.emit(CurrentMode.PASSAGE)
  }

  constructor (private localDataService: LocalDataService, private wordDataService: WordDataService) {}

  inputText = '';

  submitText(event: Event): void {
    event.preventDefault();
    this.wordDataService.submitText(this.inputText);
    this.switchToPassageMode()
  }

  loadData(): void {
    const loadedData = this.localDataService.getItem("localData")
    if ("words" in loadedData) {
      this.wordDataService.setAllWords(loadedData.words)
    }
    else { alert("Data is corrupted and cannot be loaded. Save over it with new text.")}
  }

  startFromLoadedData(): void {
    this.loadData()
    this.switchToPassageMode()
  }
}
