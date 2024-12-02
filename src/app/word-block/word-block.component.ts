import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface WordState {
  id: number,
  text: string,
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
  words: WordState[] = [];
  allWords: WordState[] = [];
  showForm = true
  snippetSize: number = 100;
  inGradingMode: boolean = false;
  lastGuessedWordId = 0;

  submitText(event: Event): void {
    event.preventDefault();
    let nextAvailableId = 0
    this.allWords = this.inputText.split(' ').map(word => ({
      id: nextAvailableId++,
      text: word,
      isHidden: false,
      numEasy: 0,
      numHard: 0,
      numMissed: 0,
    }));
    this.words = this.allWords.slice()
    this.showForm = false;
  }

  revealForm(): void {
    this.showForm = true
  }

  toggleWord(index: number): void {
    if (this.inGradingMode) {return}
    if (this.words[index].isHidden) {
      this.words[index].isHidden = false;
      this.inGradingMode = true;
      this.lastGuessedWordId = this.words[index].id;
    }
  }

  showRandomSnippet(): void {
    if (this.allWords.length <= this.snippetSize) {
      this.words = this.allWords.slice();
      this.hideRandomWords();
      return;
    }
    const maxStartingWord = this.allWords.length - this.snippetSize + 1; //+1 so it includes itself
    const startingWord = Math.floor(Math.random() * (maxStartingWord));
    this.words = this.allWords.slice(startingWord, (startingWord+this.snippetSize));
    this.hideRandomWords();
  }

  hideRandomWords(): void {
      this.words = this.words.map(word => ({
        ...word,
        isHidden: this.twentyPercentChance()
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
    let word: WordState = this.words[index]
    if (word.isHidden) {return '#333'}

    let red = 255
    let blue = 255
    let green = 255

    red += word.numMissed * 40
    blue -= word.numMissed * 20
    green -= word.numMissed * 20

    red += word.numHard * 20
    blue -= word.numHard * 40
    green += word.numHard * 20

    red -= word.numEasy * 20
    blue -= word.numEasy * 20
    green += word.numEasy * 40

    red = this.normalizeColor(red)
    blue = this.normalizeColor(blue)
    green = this.normalizeColor(green)

    let hex = '#' + [red, green, blue].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
    return hex
  }

  normalizeColor(color: number): number {
    if (color < 0) {return 0}
    if (color > 255) {return 255}
    return color
  }

  twentyPercentChance(): boolean {
    const rand = Math.floor(Math.random() * 10)
    if (rand < 3) { //0, 1, 2 so 30% chance
      return true
    } 
    return false
  }

}
