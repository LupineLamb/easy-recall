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
}

