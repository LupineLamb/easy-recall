import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradingModeComponent } from './grading-mode.component';
import { WordState } from '../../interfaces/word-state';

describe('GradingModeComponent', () => {
  let component: GradingModeComponent;
  let fixture: ComponentFixture<GradingModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradingModeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradingModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment word stats when each grading button is clicked', () => {
    const dummyWord = getDummyWord(0, false);
    dummyWord.numEasy = 0;
    dummyWord.numHard = 0;
    dummyWord.numMissed = 0;
    component.allWords = [dummyWord];
    component.lastGuessedWordId = 0;

    component.wordWasCorrect();
    expect(component.allWords[0].numEasy).withContext('Clicked "Got it!"').toBe(1);
    component.wordWasMissed();
    expect(component.allWords[0].numMissed).withContext('Clicked "Word was missed"').toBe(1);   
  });
  it('should increment mastery when "Word was easy" button is clicked', () => {
    const dummyWord = getDummyWord(0, false);
    dummyWord.masteryPoints = 0;
    component.allWords = [dummyWord];
    component.lastGuessedWordId = 0;

    component.wordWasCorrect();
    expect(component.allWords[0].masteryPoints).toBe(1);
    component.wordWasCorrect();
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
  it('should return to passage mode when any grading button is clicked', () => {
    spyOn(component, 'switchToPassageMode')
    const dummyWord = getDummyWord(0, false);
    component.allWords = [dummyWord];
    component.lastGuessedWordId = 0;

    component.wordWasCorrect();
    expect(component.switchToPassageMode).withContext('Clicked "Got it!"').toHaveBeenCalledTimes(1)
    component.wordWasMissed();
    expect(component.switchToPassageMode).withContext('Clicked "Word was missed"').toHaveBeenCalledTimes(2)
    component.skipGrading();
    expect(component.switchToPassageMode).withContext('Clicked "Skip"').toHaveBeenCalledTimes(3)
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