import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-word-block',
  templateUrl: './word-block.component.html',
  styleUrls: ['./word-block.component.css'],
  imports: [CommonModule]
})
export class WordBlockComponent {
  text = 'The quick brown fox jumps over the lazy dog';
  words = this.text.split(' ').map(word => ({
    text: word,
    isHidden: true
  }));

  toggleWord(index: number): void {
    if (this.words[index].isHidden) {
      this.words[index].isHidden = false;
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
