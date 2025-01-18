import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradingModeComponent } from './grading-mode.component';
import { WordState } from '../../interfaces/word-state';
import { WordDataService } from '../../services/word-data/word-data.service';

describe('GradingModeComponent', () => {
  let component: GradingModeComponent;
  let mockWordDataService: jasmine.SpyObj<WordDataService>;
  let fixture: ComponentFixture<GradingModeComponent>;

  beforeEach(async () => {
    mockWordDataService = jasmine.createSpyObj('WordDataService', [
      'getSnippetForGrading',
      'getWordIdBeingGraded',
      'getTextColor',
      'getTextBackground',
      'wordWasCorrect',
      'wordWasMissed',
      'getAllWords'],
    {
      ...new WordDataService(),
      getSnippetForGrading: jasmine.createSpy('getSnippetForGrading').and.returnValue([getDummyWord(0, false)]),
      getAllWords: jasmine.createSpy('getAllWords').and.returnValue([getDummyWord(0, false)]),
      getWordIdBeingGraded: jasmine.createSpy('getWordIdBeingGraded').and.returnValue(0),
    });
    await TestBed.configureTestingModule({
      imports: [GradingModeComponent],
      providers: [{provide: WordDataService, useValue: mockWordDataService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GradingModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return to passage mode when any grading button is clicked', () => {
    spyOn(component, 'switchToPassageMode')

    component.wordWasCorrect();
    expect(component.switchToPassageMode).withContext('Clicked "Got it!"').toHaveBeenCalledTimes(1)
    component.wordWasMissed();
    expect(component.switchToPassageMode).withContext('Clicked "Word was missed"').toHaveBeenCalledTimes(2)
    component.skipGrading();
    expect(component.switchToPassageMode).withContext('Clicked "Skip"').toHaveBeenCalledTimes(3)
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