import { TestBed } from '@angular/core/testing';

import { WordDataService } from './word-data.service';

describe('WordDataService', () => {
  let service: WordDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WordDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
