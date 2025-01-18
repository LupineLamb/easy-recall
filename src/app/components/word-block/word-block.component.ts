import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalData } from '../../interfaces/local-data';
import { LocalDataService } from '../../services/local-data.service';
import { WordState } from '../../interfaces/word-state';
import { CurrentMode } from '../../enums/current-mode';
import { WordDataService } from '../../services/word-data/word-data.service';

@Component({
  selector: 'app-word-block',
  templateUrl: './word-block.component.html',
  styleUrls: ['./word-block.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class WordBlockComponent {
  @Output() switchMode = new EventEmitter<CurrentMode>();
  switchToInputMode() {
    this.switchMode.emit(CurrentMode.INPUT)
  }
  switchToGradingMode() {
    this.switchMode.emit(CurrentMode.GRADING)
  }
  wordsToDisplay: WordState[];
  snippetSize: number = 100;

  inGradingMode: boolean = false;
  lastGuessedWordId: number | null = null;

  hidLastWord = false;
  commonWords: string[] = ['a', 'an', 'the', 'of', 'for', 
                           'to', 'on', 'by', 'as', 'so', 
                           'if', 'then', 'but', 'and', 'with',
                          'this', 'that', 'in', 'you', 'your'];

    constructor (private localDataService: LocalDataService, private wordDataService: WordDataService) {
      this.wordsToDisplay = wordDataService.getWordsToDisplay();
    }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
      if (event.key == ' ') {
        event.preventDefault();
        this.showRandomSnippet()
      }
      return;
    }

  toggleWord(index: number): void {
    const word = this.wordsToDisplay[index]
    if (word.isHidden) {
      this.wordDataService.prepareWordForGrading(word.id);
      this.switchToGradingMode();
    }
  }

  showRandomSnippet(): void {
    this.wordsToDisplay = this.wordDataService.getRandomSnippet(this.snippetSize);
  }

  saveData(): void {
    const dataToSave: LocalData = {
        id: "test data",
        words: this.wordDataService.getAllWords()
    }
    this.localDataService.setItem("localData", dataToSave)
  }

  wordIsMastered(word: WordState): boolean {
    return (word.masteryPoints >= 3)
  }

  getTextColor(index: number): string {
    return this.wordDataService.getTextColor(index)
  }

  getTextBackground(index: number): string {
    return this.wordDataService.getTextBackground(index)
  }
}
