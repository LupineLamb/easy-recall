import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface WordState {
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
  lastGuessedWord = '';

  submitText(event: Event): void {
    event.preventDefault();
    this.allWords = this.inputText.split(' ').map(word => ({
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
      this.lastGuessedWord = this.words[index].text
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
  }

  wordWasHard(): void {
    this.inGradingMode = false
  }

  wordWasMissed(): void {
    this.inGradingMode = false
  }

  twentyPercentChance(): boolean {
    const rand = Math.floor(Math.random() * 10)
    if (rand < 3) { //0, 1, 2 so 30% chance
      return true
    } 
    return false
  }

}
