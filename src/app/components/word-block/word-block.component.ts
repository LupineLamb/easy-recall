import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalData } from '../../interfaces/local-data';
import { LocalDataService } from '../../services/local-data.service';
import { WordState } from '../../interfaces/word-state';
import { CurrentMode } from '../../enums/current-mode';

@Component({
  selector: 'app-word-block',
  templateUrl: './word-block.component.html',
  styleUrls: ['./word-block.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class WordBlockComponent {
  @Output() switchMode = new EventEmitter<CurrentMode>();

  switchToGradingMode() {
    this.switchMode.emit(CurrentMode.GRADING)
  }
  constructor (private localDataService: LocalDataService) {}
  wordsToDisplay: WordState[] = [];
  allWords: WordState[] = [];
  snippetSize: number = 100;

  showForm = true

  inGradingMode: boolean = false;
  lastGuessedWordId: number | null = null;

  hidLastWord = false;
  commonWords: string[] = ['a', 'an', 'the', 'of', 'for', 
                           'to', 'on', 'by', 'as', 'so', 
                           'if', 'then', 'but', 'and', 'with',
                          'this', 'that', 'in', 'you', 'your'];

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.showForm) { return }
    if (!this.inGradingMode) {
      if (event.key == ' ') {
        event.preventDefault();
        this.showRandomSnippet()
      }
      return
    }
  }

  revealForm(): void {
    this.showForm = true
  }

  toggleWord(index: number): void {
    if (this.inGradingMode) {return}
    if (this.wordsToDisplay[index].isHidden) {
      this.wordsToDisplay[index].isHidden = false;
      this.inGradingMode = true;
      this.lastGuessedWordId = this.wordsToDisplay[index].id;
    }
  }

  showRandomSnippet(): void {
    if (this.allWords.length <= this.snippetSize) {
      this.wordsToDisplay = this.allWords.slice();
      this.hideRandomWords();
      return;
    }
    const startingWord = this.getStartingWord();
    if (startingWord + this.snippetSize > this.allWords.length) {
      this.wordsToDisplay = this.allWords.slice(startingWord)
      const remainingWordCount = this.snippetSize - (this.allWords.length - startingWord)
      this.wordsToDisplay = this.wordsToDisplay.concat(this.allWords.slice(0, remainingWordCount))
    }
    else {
      this.wordsToDisplay = this.allWords.slice(startingWord, (startingWord+this.snippetSize));
    }
    this.hideRandomWords();
  }

  getStartingWord(): number {
    return Math.floor(Math.random() * (this.allWords.length));
  }

  hideRandomWords(): void {
      this.wordsToDisplay = this.wordsToDisplay.map(word => ({
        ...word,
        isHidden: this.randomlyHideWord(word)
      }));
  }

  saveData(): void {
    const dataToSave: LocalData = {
        id: "test data",
        words: this.allWords
    }
    this.localDataService.setItem("localData", dataToSave)
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
    this.showForm = false
  }

  wordIsMastered(word: WordState): boolean {
    return (word.masteryPoints >= 3)
  }

  getTextColor(index: number): string {
    let word: WordState = this.wordsToDisplay[index]
    if (word.isHidden) {return `rgba(255, 255, 255, 0)`}
    if (this.commonWords.includes(word.text.toLocaleLowerCase())) {
      return `rgba(200, 200, 255, 0.3)`
    }
    if (this.wordIsMastered(word)) {return `rgba(255, 255, 100, 0.3)`}

    let opacity = 0.7;

    opacity += word.numMissed * 0.15
    opacity += word.numHard * 0.05
    opacity -= word.numEasy * 0.1

    if (opacity < 0.2) { opacity = 0.2}
    if (opacity > 1) { opacity = 1}

    return `rgba(255, 255, 255, ${opacity})`
  }

  getTextBackground(index: number): string {
    let word: WordState = this.wordsToDisplay[index]
    if (word.isHidden) {return `rgba(255, 255, 255, 0.1)`}
    return `rgba(255, 255, 255, 0)`
  }

  randomlyHideWord(word: WordState): boolean {
    if (this.commonWords.includes(word.text.toLowerCase())) {
      this.hidLastWord = false;
      return false
    }

    if (this.wordIsMastered(word)) {
      this.hidLastWord = false;
      return false
    }

    let percentChance = 15;
    if (this.hidLastWord) { percentChance = 5}
    const willHide = this.xPercentChance(percentChance);

    this.hidLastWord = willHide;
    return willHide
  }

  xPercentChance(x: number): boolean {
    const rand = Math.floor(Math.random() * 100)
    if (rand < x) { //0 inclusive means x exclusive
      return true
    } 
    return false
  }

}
