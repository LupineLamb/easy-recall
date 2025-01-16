import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CurrentMode } from '../../enums/current-mode';
import { WordState } from '../../interfaces/word-state';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grading-mode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grading-mode.component.html',
  styleUrl: './grading-mode.component.css'
})
export class GradingModeComponent {
  @Output() switchMode = new EventEmitter<CurrentMode>();
  lastGuessedWordId: number | null = null;
  allWords: WordState[] = [];
  wordsToDisplay: WordState[] = []
  commonWords: string[] = [];

  switchToInputMode(): void {
    this.switchMode.emit(CurrentMode.INPUT)
  }
  switchToPassageMode(): void {
    this.switchMode.emit(CurrentMode.PASSAGE)
  }

  @HostListener('window:keydown', ['$event'])
    handleKeyDown(event: KeyboardEvent) {
      //In grading mode:
      event.preventDefault();
      switch (event.key) {
        case '1':
          this.wordWasCorrect();
          break;
        case '2':
          this.wordWasMissed();
          break;
        case '3':
          this.skipGrading();
          break;
      }
  
    }

    wordWasCorrect(): void {
      if (this.lastGuessedWordId != null) {
        this.allWords[this.lastGuessedWordId].numEasy += 1
        this.allWords[this.lastGuessedWordId].masteryPoints += 1
      }
      this.switchToPassageMode()
    }
  
    wordWasMissed(): void {
      if (this.lastGuessedWordId != null) {
        this.allWords[this.lastGuessedWordId].numMissed += 1
        this.allWords[this.lastGuessedWordId].masteryPoints = 0
      }
      this.switchToPassageMode()
    }

    skipGrading(): void {
      this.switchToPassageMode()
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

    wordIsMastered(word: WordState): boolean {
      return (word.masteryPoints >= 3)
    }

}
