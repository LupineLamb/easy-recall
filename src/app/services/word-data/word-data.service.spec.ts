import { TestBed } from '@angular/core/testing';

import { WordDataService } from './word-data.service';
import { WordState } from '../../interfaces/word-state';

describe('WordDataService', () => {
  let service: WordDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should process input text into lines and words', () => {
    let allWords: WordState[];

    service.submitText("Two words");
    allWords = service.getAllWords();
    expect(allWords.length).toBe(2);
    expect(allWords[0].beginsLine).toBe(true);
    expect(allWords[1].beginsLine).toBe(false);

    service.submitText("Two\nlines");
    allWords = service.getAllWords();
    expect(allWords.length).toBe(2);
    expect(allWords[0].beginsLine).toBe(true);
    expect(allWords[1].beginsLine).toBe(true);

    service.submitText("Two\nlines, four words");
    allWords = service.getAllWords();
    expect(allWords.length).toBe(4);
    expect(allWords[0].beginsLine).toBe(true);
    expect(allWords[1].beginsLine).toBe(true);
    expect(allWords[2].beginsLine).toBe(false);
    expect(allWords[3].beginsLine).toBe(false);
  });


  it('should always make hidden words invisible', () => {
    const hiddenWord = getDummyWord(0, true)
    service.setWordsToDisplay([hiddenWord]);
    
    expect(service.getTextColor(0)).toBe(`rgba(255, 255, 255, 0)`);
  });
  it('should always make common words dull-colored', () => {
    const dummyWord = getDummyWord(0, false)
    dummyWord.text = "tHe" //To test that it converts to lowercare
    service.setWordsToDisplay([dummyWord]);
    
    expect(service.getTextColor(0)).toBe(`rgba(200, 200, 255, 0.3)`);
  });
  it('should always make mastered words gold-colored', () => {
    const dummyWord = getDummyWord(0, false);
    service.setWordsToDisplay([dummyWord]);
    const masterySpy = spyOn<any>(service, 'wordIsMastered')
    masterySpy.and.returnValue(true)
    
    expect(service.getTextColor(0)).toBe(`rgba(255, 255, 100, 0.3)`);
  });
  it('should make frequently missed words fully opaque', () => {
    const dummyWord = getDummyWord(0, false);
    dummyWord.numMissed = 999;
    service.setWordsToDisplay([dummyWord]);
    
    expect(service.getTextColor(0)).toBe(`rgba(255, 255, 255, 1)`);
  });
  it('should make frequently hard words fully opaque', () => {
    const dummyWord = getDummyWord(0, false);
    dummyWord.numHard = 999;
    service.setWordsToDisplay([dummyWord]);
    
    expect(service.getTextColor(0)).toBe(`rgba(255, 255, 255, 1)`);
  });
  it('should make frequently easy words almost transparent', () => {
    const dummyWord = getDummyWord(0, false);
    dummyWord.numEasy = 999;
   service.setWordsToDisplay([dummyWord]);
    
    expect(service.getTextColor(0)).toBe(`rgba(255, 255, 255, 0.2)`);
  });

  it('should give only hidden words a background color', () => {
    const dummyWord = getDummyWord(0, true);
    const dummyWord1 = getDummyWord(1, false)
    service.setWordsToDisplay([dummyWord, dummyWord1]);

    expect(service.getTextBackground(0)).toBe(`rgba(255, 255, 255, 0.1)`);
    expect(service.getTextBackground(1)).toBe(`rgba(255, 255, 255, 0)`);
  });



  it('should show the right snippet size and loop appropriately', () => {
    const dummyWord1 = getDummyWord(0, false);
    const dummyWord2 = getDummyWord(1, false);
    const dummyWord3 = getDummyWord(2, false);
    const dummyWord4 = getDummyWord(3, false);
    const dummyWord5 = getDummyWord(4, false);
    service.setAllWords([dummyWord1, dummyWord2, dummyWord3, dummyWord4, dummyWord5]);

    const getStartingWordSpy = spyOn<any>(service, 'getStartingWord')
    const hideRandomWordsSpy = spyOn<any>(service, 'hideRandomWords')

    getStartingWordSpy.and.returnValue(3);
    let snippetSize = 5;
    let randomSnippet = service.getRandomSnippet(snippetSize);
    expect(randomSnippet.length).toBe(5)
    expect(randomSnippet[0].id).toBe(0)
    expect(randomSnippet[4].id).toBe(4)

    getStartingWordSpy.and.returnValue(3);
    snippetSize = 3;
    randomSnippet = service.getRandomSnippet(snippetSize);
    expect(randomSnippet.length).toBe(3)
    expect(randomSnippet[0].id).toBe(3)
    expect(randomSnippet[2].id).toBe(0)

    getStartingWordSpy.and.returnValue(1);
    snippetSize = 3;
    randomSnippet = service.getRandomSnippet(snippetSize);
    expect(randomSnippet.length).toBe(3)
    expect(randomSnippet[0].id).toBe(1)
    expect(randomSnippet[2].id).toBe(3)
   
    expect(hideRandomWordsSpy).withContext('Called showRandomSnippet 3 times, should call hideRandomWords 3 times').toHaveBeenCalledTimes(3);
  });



  it('should never hide common words', () => {
    const commonWord = getDummyWord(0, false);
    commonWord.text = "tHe"
    const xPercentChanceSpy = spyOn<any>(service, 'xPercentChance')
    xPercentChanceSpy.and.returnValue(true)
    service.setHidLastWord(false);

    expect(service.randomlyHideWord(commonWord)).toBe(false)
    expect(service.wasLastWordHidden()).toBe(false)
  });
  it('should never hide mastered words', () => {
    const dummyWord = getDummyWord(0, false);
    const xPercentChanceSpy = spyOn<any>(service, 'xPercentChance')
    xPercentChanceSpy.and.returnValue(true)
    const wordIsMasteredSpy = spyOn<any>(service, 'wordIsMastered')
    wordIsMasteredSpy.and.returnValue(true)
    service.setHidLastWord(false);

    expect(service.randomlyHideWord(dummyWord)).toBe(false)
    expect(service.wasLastWordHidden()).toBe(false)
  });
  it('should randomly hide non-mastered words', () => {
    const dummyWord = getDummyWord(0, false);
    const xPercentChanceSpy = spyOn<any>(service, 'xPercentChance')
    const wordIsMasteredSpy = spyOn<any>(service, 'wordIsMastered')
    wordIsMasteredSpy.and.returnValue(false)

    service.setHidLastWord(false);
    xPercentChanceSpy.and.returnValue(true)
    expect(service.randomlyHideWord(dummyWord)).toBe(true)
    expect(service.wasLastWordHidden()).toBe(true)

    service.setHidLastWord(true);
    xPercentChanceSpy.and.returnValue(false)
    expect(service.randomlyHideWord(dummyWord)).toBe(false)
    expect(service.wasLastWordHidden()).toBe(false)
  });



  it('should increment word stats when each grading button is clicked', () => {
    const dummyWord = getDummyWord(0, false);
    dummyWord.numEasy = 0;
    dummyWord.numHard = 0;
    dummyWord.numMissed = 0;
    service.setAllWords([dummyWord]);
    const id = 0

    service.wordWasCorrect(id);
    expect(service.getAllWords()[0].numEasy).withContext('Clicked "Got it!"').toBe(1);
    service.wordWasMissed(id);
    expect(service.getAllWords()[0].numMissed).withContext('Clicked "Word was missed"').toBe(1);   
  });
  it('should increment mastery when "Word was easy" button is clicked', () => {
    const dummyWord = getDummyWord(0, false);
    dummyWord.masteryPoints = 0;
    service.setAllWords([dummyWord]);
    const id = 0

    service.wordWasCorrect(id);
    expect(service.getAllWords()[0].masteryPoints).toBe(1);
    service.wordWasCorrect(id);
    expect(service.getAllWords()[0].masteryPoints).toBe(2);
  });
  it('should reset mastery points when "Word was missed" button is clicked', () => {
    const dummyWord = getDummyWord(0, false);
    dummyWord.masteryPoints = 2;
    service.setAllWords([dummyWord]);
    const id = 0

    service.wordWasMissed(id);
    expect(service.getAllWords()[0].masteryPoints).toBe(0);
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
});

