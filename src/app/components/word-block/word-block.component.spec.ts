import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordBlockComponent } from './word-block.component';
import { WordState } from '../../interfaces/word-state';

describe('WordBlockComponent', () => {
  let component: WordBlockComponent;
  let fixture: ComponentFixture<WordBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordBlockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should only show new snippet when not showing form or grading', () => {
    spyOn(component, 'showRandomSnippet');
    const fakeEvent = new KeyboardEvent('keypress', {key: ' '});

    component.showForm = false;
    component.inGradingMode = false;
    component.handleKeyDown(fakeEvent);

    component.showForm = false;
    component.inGradingMode = true;
    component.handleKeyDown(fakeEvent);

    component.showForm = true;
    component.inGradingMode = false;
    component.handleKeyDown(fakeEvent);

    component.showForm = true;
    component.inGradingMode = true;
    component.handleKeyDown(fakeEvent);

    expect(component.showRandomSnippet).toHaveBeenCalledTimes(1);
  });
  it('should only accept grading inputs when in grading mode', () => {
    spyOn(component, 'wordWasEasy');
    spyOn(component, 'wordWasHard');
    spyOn(component, 'wordWasMissed');
    spyOn(component, 'skipGrading');
    const fakeEasy = new KeyboardEvent('keypress', {key: '1'});
    const fakeHard = new KeyboardEvent('keypress', {key: '2'});
    const fakeMissed = new KeyboardEvent('keypress', {key: '3'});
    const fakeSkipped = new KeyboardEvent('keypress', {key: '4'});
    component.showForm = false;
    
    component.inGradingMode = false;
    component.handleKeyDown(fakeEasy);
    component.handleKeyDown(fakeHard);
    component.handleKeyDown(fakeMissed);
    component.handleKeyDown(fakeSkipped);

    component.inGradingMode = true;
    component.handleKeyDown(fakeEasy);
    component.handleKeyDown(fakeHard);
    component.handleKeyDown(fakeMissed);
    component.handleKeyDown(fakeSkipped);

    expect(component.wordWasEasy).toHaveBeenCalledTimes(1);
    expect(component.wordWasHard).toHaveBeenCalledTimes(1);
    expect(component.wordWasMissed).toHaveBeenCalledTimes(1);
    expect(component.skipGrading).toHaveBeenCalledTimes(1);
  });
  it('should never accept grading inputs when showing the form', () => {
    spyOn(component, 'wordWasEasy');
    spyOn(component, 'wordWasHard');
    spyOn(component, 'wordWasMissed');
    spyOn(component, 'skipGrading');
    const fakeEasy = new KeyboardEvent('keypress', {key: '1'});
    const fakeHard = new KeyboardEvent('keypress', {key: '2'});
    const fakeMissed = new KeyboardEvent('keypress', {key: '3'});
    const fakeSkipped = new KeyboardEvent('keypress', {key: '4'});
    component.showForm = true;
    
    component.inGradingMode = false;
    component.handleKeyDown(fakeEasy);
    component.handleKeyDown(fakeHard);
    component.handleKeyDown(fakeMissed);
    component.handleKeyDown(fakeSkipped);

    component.inGradingMode = true;
    component.handleKeyDown(fakeEasy);
    component.handleKeyDown(fakeHard);
    component.handleKeyDown(fakeMissed);
    component.handleKeyDown(fakeSkipped);

    expect(component.wordWasEasy).toHaveBeenCalledTimes(0);
    expect(component.wordWasHard).toHaveBeenCalledTimes(0);
    expect(component.wordWasMissed).toHaveBeenCalledTimes(0);
    expect(component.skipGrading).toHaveBeenCalledTimes(0);
  });



  it('should process input text into lines and words', () => {
    component.inputText = "Two words"
    component.submitText(new Event(''))
    expect(component.allWords.length).toBe(2)
    expect(component.allWords[0].beginsLine).toBe(true)
    expect(component.allWords[1].beginsLine).toBe(false)

    component.inputText = "Two\nlines"
    component.submitText(new Event(''))
    expect(component.allWords.length).toBe(2)
    expect(component.allWords[0].beginsLine).toBe(true)
    expect(component.allWords[1].beginsLine).toBe(true)

    component.inputText = "Two\nlines, four words"
    component.submitText(new Event(''))
    expect(component.allWords.length).toBe(4)
    expect(component.allWords[0].beginsLine).toBe(true)
    expect(component.allWords[1].beginsLine).toBe(true)
    expect(component.allWords[2].beginsLine).toBe(false)
    expect(component.allWords[3].beginsLine).toBe(false)
  });
  it('should hide the form when text is submitted', () => {
    component.inputText = "Dummy text"
    component.showForm = true;
    component.submitText(new Event(''))
    expect(component.showForm).toBe(false)
  });



  it('should grade a new word when a hidden word is clicked out of grading mode', () => {
    const hiddenWord = getDummyWord(0, true)
    component.wordsToDisplay = [hiddenWord];
    component.inGradingMode = false;
    component.toggleWord(0);

    expect(component.wordsToDisplay[0].isHidden).withContext('should reveal hidden word').toBe(false);
    expect(component.inGradingMode).withContext('should activate grading mode').toBe(true);
    expect(component.lastGuessedWordId).withContext('should update last guessed ID').toBe(0);
  });
  it('should not grade a new word when hidden word is clicked in grading mode', () => {
    const hiddenWord = getDummyWord(0, true)
    component.wordsToDisplay = [hiddenWord];
    component.inGradingMode = true;
    component.toggleWord(0);

    expect(component.wordsToDisplay[0].isHidden).withContext('should not reveal hidden word').toBe(true);
    expect(component.inGradingMode).withContext('should not change grading mode').toBe(true);
    expect(component.lastGuessedWordId).withContext('should not update last guessed ID').toBe(null);
  });
  it('should do nothing when a non-hidden word is clicked', () => {
    const revealedWord = getDummyWord(0, false)
    component.wordsToDisplay = [revealedWord];
    component.inGradingMode = false;
    component.toggleWord(0);

    expect(component.wordsToDisplay[0].isHidden).withContext('should not hide revealed word').toBe(false);
    expect(component.inGradingMode).withContext('should not enter grading mode').toBe(false);
    expect(component.lastGuessedWordId).withContext('should not update last guessed ID').toBe(null);
  });



  it('should always make hidden words invisible', () => {
    const hiddenWord = getDummyWord(0, true)
    component.wordsToDisplay = [hiddenWord];
    
    expect(component.getTextColor(0)).toBe(`rgba(255, 255, 255, 0)`);
  });
  it('should always make common words dull-colored', () => {
    const dummyWord = getDummyWord(0, false)
    dummyWord.text = "tHe" //To test that it converts to lowercare
    component.wordsToDisplay = [dummyWord];
    
    expect(component.getTextColor(0)).toBe(`rgba(200, 200, 255, 0.3)`);
  });
  it('should always make mastered words gold-colored', () => {
    const dummyWord = getDummyWord(0, false);
    component.wordsToDisplay = [dummyWord];
    const masterySpy = spyOn<any>(component, 'wordIsMastered')
    masterySpy.and.returnValue(true)
    
    expect(component.getTextColor(0)).toBe(`rgba(255, 255, 100, 0.3)`);
  });
  it('should make frequently missed words fully opaque', () => {
    const dummyWord = getDummyWord(0, false);
    dummyWord.numMissed = 999;
    component.wordsToDisplay = [dummyWord];
    
    expect(component.getTextColor(0)).toBe(`rgba(255, 255, 255, 1)`);
  });
  it('should make frequently hard words fully opaque', () => {
    const dummyWord = getDummyWord(0, false);
    dummyWord.numHard = 999;
    component.wordsToDisplay = [dummyWord];
    
    expect(component.getTextColor(0)).toBe(`rgba(255, 255, 255, 1)`);
  });
  it('should make frequently easy words almost transparent', () => {
    const dummyWord = getDummyWord(0, false);
    dummyWord.numEasy = 999;
    component.wordsToDisplay = [dummyWord];
    
    expect(component.getTextColor(0)).toBe(`rgba(255, 255, 255, 0.2)`);
  });

  it('should give only hidden words a background color', () => {
    const dummyWord = getDummyWord(0, true);
    const dummyWord1 = getDummyWord(1, false)
    component.wordsToDisplay = [dummyWord, dummyWord1];

    expect(component.getTextBackground(0)).toBe(`rgba(255, 255, 255, 0.1)`);
    expect(component.getTextBackground(1)).toBe(`rgba(255, 255, 255, 0)`);
  });


  it('should increment word stats when each grading button is clicked', () => {
    const dummyWord = getDummyWord(0, false);
    dummyWord.numEasy = 0;
    dummyWord.numHard = 0;
    dummyWord.numMissed = 0;
    component.allWords = [dummyWord];
    component.lastGuessedWordId = 0;

    component.wordWasEasy();
    expect(component.allWords[0].numEasy).withContext('Clicked "Word was easy"').toBe(1);
    component.wordWasHard();
    expect(component.allWords[0].numHard).withContext('Clicked "Word was hard"').toBe(1);
    component.wordWasMissed();
    expect(component.allWords[0].numMissed).withContext('Clicked "Word was missed"').toBe(1);   
  });
  it('should increment mastery when "Word was easy" button is clicked', () => {
    const dummyWord = getDummyWord(0, false);
    dummyWord.masteryPoints = 0;
    component.allWords = [dummyWord];
    component.lastGuessedWordId = 0;

    component.wordWasEasy();
    expect(component.allWords[0].masteryPoints).toBe(1);
    component.wordWasEasy();
    expect(component.allWords[0].masteryPoints).toBe(2);
  });
  it('should reset mastery points when "Word was missed" button is clicked', () => {
    const dummyWord = getDummyWord(0, false);
    dummyWord.masteryPoints = 2;
    component.allWords = [dummyWord];
    component.lastGuessedWordId = 0;

    component.wordWasMissed();
    expect(component.allWords[0].masteryPoints).toBe(0);
  });
  it('should turn off grading mode when any grading button is clicked', () => {
    const dummyWord = getDummyWord(0, false);
    component.allWords = [dummyWord];
    component.lastGuessedWordId = 0;

    component.inGradingMode = true;
    component.wordWasEasy();
    expect(component.inGradingMode).withContext('Clicked "Word was easy"').toBe(false);
    component.inGradingMode = true;
    component.wordWasHard();
    expect(component.inGradingMode).withContext('Clicked "Word was hard"').toBe(false);
    component.inGradingMode = true;
    component.wordWasMissed();
    expect(component.inGradingMode).withContext('Clicked "Word was missed"').toBe(false);
    component.inGradingMode = true;
    component.skipGrading();
    expect(component.inGradingMode).withContext('Clicked "Skip"').toBe(false);
  });



  it('should show the right snippet size and loop appropriately', () => {
    const dummyWord1 = getDummyWord(0, false);
    const dummyWord2 = getDummyWord(1, false);
    const dummyWord3 = getDummyWord(2, false);
    const dummyWord4 = getDummyWord(3, false);
    const dummyWord5 = getDummyWord(4, false);
    component.allWords = [dummyWord1, dummyWord2, dummyWord3, dummyWord4, dummyWord5];

    const getStartingWordSpy = spyOn<any>(component, 'getStartingWord')
    const hideRandomWordsSpy = spyOn<any>(component, 'hideRandomWords')

    getStartingWordSpy.and.returnValue(3);
    component.snippetSize = 5;
    component.showRandomSnippet();
    expect(component.wordsToDisplay.length).toBe(5)
    expect(component.wordsToDisplay[0].id).toBe(0)
    expect(component.wordsToDisplay[4].id).toBe(4)

    getStartingWordSpy.and.returnValue(3);
    component.snippetSize = 3;
    component.showRandomSnippet();
    expect(component.wordsToDisplay.length).toBe(3)
    expect(component.wordsToDisplay[0].id).toBe(3)
    expect(component.wordsToDisplay[2].id).toBe(0)

    getStartingWordSpy.and.returnValue(1);
    component.snippetSize = 3;
    component.showRandomSnippet();
    expect(component.wordsToDisplay.length).toBe(3)
    expect(component.wordsToDisplay[0].id).toBe(1)
    expect(component.wordsToDisplay[2].id).toBe(3)
   
    expect(hideRandomWordsSpy).withContext('Called showRandomSnippet 3 times, should call hideRandomWords 3 times').toHaveBeenCalledTimes(3);
  });



  it('should never hide common words', () => {
    const commonWord = getDummyWord(0, false);
    commonWord.text = "tHe"
    const xPercentChanceSpy = spyOn<any>(component, 'xPercentChance')
    xPercentChanceSpy.and.returnValue(true)
    component.hidLastWord = false;

    expect(component.randomlyHideWord(commonWord)).toBe(false)
    expect(component.hidLastWord).toBe(false)
  });
  it('should never hide mastered words', () => {
    const dummyWord = getDummyWord(0, false);
    const xPercentChanceSpy = spyOn<any>(component, 'xPercentChance')
    xPercentChanceSpy.and.returnValue(true)
    const wordIsMasteredSpy = spyOn<any>(component, 'wordIsMastered')
    wordIsMasteredSpy.and.returnValue(true)
    component.hidLastWord = false;

    expect(component.randomlyHideWord(dummyWord)).toBe(false)
    expect(component.hidLastWord).toBe(false)
  });
  it('should randomly hide non-mastered words', () => {
    const dummyWord = getDummyWord(0, false);
    const xPercentChanceSpy = spyOn<any>(component, 'xPercentChance')
    const wordIsMasteredSpy = spyOn<any>(component, 'wordIsMastered')
    wordIsMasteredSpy.and.returnValue(false)

    component.hidLastWord = false;
    xPercentChanceSpy.and.returnValue(true)
    expect(component.randomlyHideWord(dummyWord)).toBe(true)
    expect(component.hidLastWord).toBe(true)

    component.hidLastWord = true;
    xPercentChanceSpy.and.returnValue(false)
    expect(component.randomlyHideWord(dummyWord)).toBe(false)
    expect(component.hidLastWord).toBe(false)
  });
});


function getDummyWord(id: number, isHidden: boolean): WordState {
  const word: WordState = {
    id,
    text: 'dummy',
    beginsLine: true,
    isHidden,
    numEasy: 0,
    numHard: 0,
    numMissed: 0,
    masteryPoints: 0,
  }
  return word
}
