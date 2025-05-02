import { TestBed } from '@angular/core/testing';

import { TaskDialogService } from './task-dialog.service';

describe('TaskDialogService', () => {
  let service: TaskDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
