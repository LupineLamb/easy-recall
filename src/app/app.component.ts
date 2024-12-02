import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WordBlockComponent } from './word-block/word-block.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WordBlockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'easy-recall';
}
