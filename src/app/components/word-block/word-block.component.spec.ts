import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordBlockComponent } from './word-block.component';
import { WordState } from '../../interfaces/word-state';
import { WordDataService } from '../../services/word-data/word-data.service';

describe('WordBlockComponent', () => {
  let component: WordBlockComponent;
  let mockWordDataService: jasmine.SpyObj<WordDataService>
  let fixture: ComponentFixture<WordBlockComponent>;

  beforeEach(async () => {
    mockWordDataService = jasmine.createSpyObj('WordDataService', ['getWordsToDisplay', 'prepareWordForGrading'])
    mockWordDataService.getWordsToDisplay.and.returnValue([]);
    await TestBed.configureTestingModule({
      imports: [WordBlockComponent],
      providers: [{provide: WordDataService, useValue: mockWordDataService}]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WordBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should show new snippet when spacebar is hit', () => {
    spyOn(component, 'showRandomSnippet');
    const fakeEvent = new KeyboardEvent('keypress', {key: ' '});

    component.handleKeyDown(fakeEvent);
    expect(component.showRandomSnippet).toHaveBeenCalledTimes(1);
  });

  it('should grade a new word when a hidden word is clicked', () => {
    const hiddenWord = getDummyWord(0, true)
    component.wordsToDisplay = [hiddenWord];
    spyOn(component, 'switchToGradingMode')
    
    component.toggleWord(0);
    expect(mockWordDataService.prepareWordForGrading).toHaveBeenCalledTimes(1);
    expect(component.switchToGradingMode).toHaveBeenCalledTimes(1);
  });
  it('should do nothing when a non-hidden word is clicked', () => {
    const revealedWord = getDummyWord(0, false)
    component.wordsToDisplay = [revealedWord];
    spyOn(component, 'switchToGradingMode')

    component.toggleWord(0);
    expect(mockWordDataService.prepareWordForGrading).toHaveBeenCalledTimes(0);
    expect(component.switchToGradingMode).toHaveBeenCalledTimes(0);
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
