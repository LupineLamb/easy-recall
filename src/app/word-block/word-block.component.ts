import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface WordState {
  id: number,
  text: string,
  beginsLine: boolean,
  isHidden: boolean,
  numEasy: number,
  numHard: number,
  numMissed: number,
}

@Component({
  selector: 'app-word-block',
  templateUrl: './word-block.component.html',
  styleUrls: ['./word-block.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class WordBlockComponent {
  inputText = ''; 
  wordsToDisplay: WordState[] = [];
  allWords: WordState[] = [];
  snippetSize: number = 100;

  showForm = true

  inGradingMode: boolean = false;
  lastGuessedWordId = 0;

  hidLastWord = false;
  commonWords: string[] = ['a', 'an', 'the', 'of', 'for', 'to', 'on', 'by', 'as', 'so', 'if', 'then', 'but', 'and', 'with'];

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
    //In grading mode:
    event.preventDefault();
    switch (event.key) {
      case '1':
        this.wordWasEasy();
        break;
      case '2':
        this.wordWasHard();
        break;
      case '3':
        this.wordWasMissed();
        break;
      case '4':
        this.skipGrading();
        break;
    }

  }

  submitText(event: Event): void {
    event.preventDefault();

    let wordsByLine: string[] = this.inputText.split('\n')
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
        });
        beginsLine=false
      });
    });

    this.wordsToDisplay = this.allWords.slice()
    this.showForm = false;
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

  skipGrading(): void {
    this.inGradingMode = false;
  }

  showRandomSnippet(): void {
    if (this.allWords.length <= this.snippetSize) {
      this.wordsToDisplay = this.allWords.slice();
      this.hideRandomWords();
      return;
    }
    const maxStartingWord = this.allWords.length - this.snippetSize + 1; //+1 so it includes itself
    const startingWord = Math.floor(Math.random() * (maxStartingWord));
    this.wordsToDisplay = this.allWords.slice(startingWord, (startingWord+this.snippetSize));
    this.hideRandomWords();
  }

  hideRandomWords(): void {
      this.wordsToDisplay = this.wordsToDisplay.map(word => ({
        ...word,
        isHidden: this.randomlyHideWord(word)
      }));
  }

  wordWasEasy(): void {
    this.inGradingMode = false
    this.allWords[this.lastGuessedWordId].numEasy += 1
  }

  wordWasHard(): void {
    this.inGradingMode = false
    this.allWords[this.lastGuessedWordId].numHard += 1
  }

  wordWasMissed(): void {
    this.inGradingMode = false
    this.allWords[this.lastGuessedWordId].numMissed += 1
  }

  getTextColor(index: number): string {
    let word: WordState = this.wordsToDisplay[index]
    if (word.isHidden) {return `rgba(255, 255, 255, 0)`}
    if (this.commonWords.includes(word.text.toLocaleLowerCase())) {
      return `rgba(255, 255, 255, 0.2)`
    }

    let opacity = 0.7;

    opacity += word.numMissed * 0.15
    opacity -= word.numHard * 0.05
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
