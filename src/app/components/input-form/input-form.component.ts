import { Component, EventEmitter, Output } from '@angular/core';
import { CurrentMode } from '../../enums/current-mode';
import { WordState } from '../../interfaces/word-state';
import { FormsModule } from '@angular/forms';
import { LocalDataService } from '../../services/local-data.service';

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

  constructor (private localDataService: LocalDataService) {}

  inputText = '';
  allWords: WordState[] = [];
  wordsToDisplay: WordState[] = [];

  submitText(event: Event): void {
    event.preventDefault();

    let wordsByLine: string[] = this.inputText.split('\n')
    this.allWords = [];
    let nextAvailableId = 0
    wordsByLine.forEach(lineString => {
      let lineArray: string[] = lineString.split(' ');
      let beginsLine = true;

      lineArray.forEach(word => {
        this.allWords.push({
          id: nextAvailableId++,
          text: word,
          beginsLine,
          isHidden: false,
          numEasy: 0,
          numHard: 0,
          numMissed: 0,
          masteryPoints: 1,
        });
        beginsLine=false
      });
    });

    this.wordsToDisplay = this.allWords.slice()
    this.switchToPassageMode()
  }

  loadData(): void {
    const loadedData = this.localDataService.getItem("localData")
    if ("words" in loadedData) {
      this.allWords = loadedData.words
      this.wordsToDisplay = this.allWords.slice()
    }
    else { alert("Data is corrupted and cannot be loaded. Save over it with new text.")}
  }

  startFromLoadedData(): void {
    this.loadData()
    this.switchToPassageMode()
  }
}
