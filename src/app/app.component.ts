import { Component } from '@angular/core';
import { WordBlockComponent } from './components/word-block/word-block.component';

@Component({
  selector: 'app-root',
  imports: [WordBlockComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'easy-recall';
}
