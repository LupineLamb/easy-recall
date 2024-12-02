import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-word-block',
  templateUrl: './word-block.component.html',
  styleUrls: ['./word-block.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class WordBlockComponent {
  inputText = ''; 
  words: { text: string; isHidden: boolean }[] = [];
  showForm = true
  snippetSize: number = 100;

  submitText(event: Event): void {
    event.preventDefault();
    this.words = this.inputText.split(' ').map(word => ({
      text: word,
      isHidden: false
    }));
    this.showForm = false;
  }

  revealForm(): void {
    this.showForm = true
  }

  toggleWord(index: number): void {
    if (this.words[index].isHidden) {
      this.words[index].isHidden = false;
    }
  }

  showRandomSnippet(): void {
    let allWords: string[] = this.inputText.split(' ');
    if (allWords.length <= this.snippetSize) {
      this.words = allWords.map(word => ({
        text: word,
        isHidden: this.twentyPercentChance()
      }));
      return
    }
    const maxStartingChar = allWords.length - this.snippetSize
    const startingChar = Math.floor(Math.random() * (maxStartingChar))
    this.words = [];
    for (let index = startingChar; index < (startingChar+this.snippetSize); index++) {
      this.words.push({
        text: allWords[index], 
        isHidden: this.twentyPercentChance()
      });
    }
  }

  hideRandomWords(): void {
      this.words = this.words.map(word => ({
        ...word,
        isHidden: this.twentyPercentChance()
      }));
  }

  twentyPercentChance(): boolean {
    const rand = Math.floor(Math.random() * 10)
    if (rand < 3) { //0, 1, 2 so 30% chance
      return true
    } 
    return false
  }

}
