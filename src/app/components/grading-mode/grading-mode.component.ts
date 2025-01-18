import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { CurrentMode } from '../../enums/current-mode';
import { WordState } from '../../interfaces/word-state';
import { CommonModule } from '@angular/common';
import { WordDataService } from '../../services/word-data/word-data.service';

@Component({
  selector: 'app-grading-mode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grading-mode.component.html',
  styleUrl: './grading-mode.component.css'
})
export class GradingModeComponent {
  @Output() switchMode = new EventEmitter<CurrentMode>();
  gradingWordId: number;
  wordsToDisplay: WordState[];

  constructor (private wordDataService: WordDataService) {
    this.wordsToDisplay = this.wordDataService.getSnippetForGrading()
    let gradingWordId = this.wordDataService.getWordIdBeingGraded()
    if (gradingWordId == null) {throw new Error("Entered grading mode without a word to grade.")}
    this.gradingWordId = gradingWordId
  }

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

    getWordForGrading(): WordState {
      return this.wordDataService.getAllWords()[this.gradingWordId];
    }

    wordWasCorrect(): void {
      this.wordDataService.wordWasCorrect(this.gradingWordId)
      this.switchToPassageMode()
    }
  
    wordWasMissed(): void {
      this.wordDataService.wordWasMissed(this.gradingWordId)
      this.switchToPassageMode()
    }

    skipGrading(): void {
      this.switchToPassageMode()
    }

    getTextColor(index: number): string {
      return this.wordDataService.getTextColor(index)
    }
  
    getTextBackground(index: number): string {
      return this.wordDataService.getTextBackground(index)
    }

}
