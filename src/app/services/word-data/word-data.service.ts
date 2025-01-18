import { Injectable } from '@angular/core';
import { WordState } from '../../interfaces/word-state';

@Injectable({
  providedIn: 'root'
})
export class WordDataService {
  private commonWords: string[] = ['a', 'an', 'the', 'of', 'for', 
    'to', 'on', 'by', 'as', 'so', 
    'if', 'then', 'but', 'and', 'with',
    'this', 'that', 'in', 'you', 'your'];

  private hidLastWord: boolean = false;
  setHidLastWord(bool: boolean): void { //Useful in unit tests
    this.hidLastWord = bool
  }

  private allWords: WordState[] = [];
  getAllWords(): WordState[] {
    return this.allWords;
  }
  setAllWords(newWords: WordState[]): void {
    this.allWords = newWords
  }

  private wordsToDisplay: WordState[] = [];
  getWordsToDisplay(): WordState[] {
    return this.wordsToDisplay;
  }
  setWordsToDisplay(newWords: WordState[]): void {
    this.wordsToDisplay = newWords
  }
  private wordIdBeingGraded: number | null = null;
  getWordIdBeingGraded(): number | null {
    return this.wordIdBeingGraded;
  }
  setWordIdBeingGraded(numOrNull: number | null) {
    this.wordIdBeingGraded = numOrNull;
  }


  constructor() { }

  submitText(inputText: string): void {
    const wordsByLine: string[] = inputText.split('\n')
    const newWords: WordState[] = [];
    let nextAvailableId = 0
    wordsByLine.forEach(lineString => {
      const lineArray: string[] = lineString.split(' ');
      let beginsLine = true;

      lineArray.forEach(word => {
        newWords.push({
          id: nextAvailableId++,
          text: word,
          beginsLine,
          isHidden: false,
          numEasy: 0,
          numHard: 0,
          numMissed: 0,
          masteryPoints: 1,
        });
        beginsLine=false
      });
    });
    this.setAllWords(newWords);
    this.setWordsToDisplay(this.allWords.slice())
  }

  wordIsMastered(word: WordState): boolean {
    return (word.masteryPoints >= 3)
  }

  prepareWordForGrading(id: number): void {
    this.allWords[id].isHidden = false;
    this.setWordIdBeingGraded(id)
  }

  getSnippetForGrading(): WordState[] {
    if (this.wordIdBeingGraded == null) {return []}

    const id: number = this.wordIdBeingGraded
    const start = Math.max(id-10, 0)
    const end = Math.min(id+10, (this.allWords.length-1))
    return this.allWords.slice(start, end) 
  }

  wordWasCorrect(id: number): void {
    this.allWords[id].numEasy += 1
    this.allWords[id].masteryPoints += 1
  }

  wordWasMissed(id: number): void {
    this.allWords[id].numMissed += 1
    this.allWords[id].masteryPoints = 0
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

  getRandomSnippet(snippetSize: number): WordState[] {
    if (this.allWords.length <= snippetSize) {
      this.wordsToDisplay = this.allWords.slice();
      this.hideRandomWords();
      return this.wordsToDisplay;
    }
    const startingWord = this.getStartingWord();
    if (startingWord + snippetSize > this.allWords.length) {
      this.wordsToDisplay = this.allWords.slice(startingWord)
      const remainingWordCount = snippetSize - (this.allWords.length - startingWord)
      this.wordsToDisplay = this.wordsToDisplay.concat(this.allWords.slice(0, remainingWordCount))
    }
    else {
      this.wordsToDisplay = this.allWords.slice(startingWord, (startingWord+snippetSize));
    }
    this.hideRandomWords();
    return this.wordsToDisplay;
  }

  getStartingWord(): number {
    return Math.floor(Math.random() * (this.allWords.length));
  }

  hideRandomWords(): void {
      this.wordsToDisplay = this.wordsToDisplay.map(word => ({
        ...word,
        isHidden: this.randomlyHideWord(word)
      }));
  }

  randomlyHideWord(word: WordState): boolean {
    if (this.commonWords.includes(word.text.toLowerCase())) {
      this.hidLastWord = false;
      return false
    }

    if (this.wordIsMastered(word)) {
      this.hidLastWord = false;
      return false
    }

    let percentChance = 15;
    if (this.hidLastWord) { percentChance = 5}
    const willHide = this.xPercentChance(percentChance);

    this.hidLastWord = willHide;
    return willHide
  }

  wasLastWordHidden(): boolean {
    return this.hidLastWord
  }

  xPercentChance(x: number): boolean {
    const rand = Math.floor(Math.random() * 100)
    if (rand < x) { //0 inclusive means x exclusive
      return true
    } 
    return false
  }

  
}
