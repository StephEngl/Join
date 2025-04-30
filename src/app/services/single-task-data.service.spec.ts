import { TestBed } from '@angular/core/testing';

import { SingleTaskDataService } from './single-task-data.service';

describe('SingleTaskDataService', () => {
  let service: SingleTaskDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingleTaskDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
