import { TestBed } from '@angular/core/testing';

import { DailyResetService } from './daily-reset.service';

describe('DailyResetService', () => {
  let service: DailyResetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailyResetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
