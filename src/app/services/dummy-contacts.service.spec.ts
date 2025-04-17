import { TestBed } from '@angular/core/testing';

import { DummyContactsService } from './dummy-contacts.service';

describe('DummyUsersService', () => {
  let service: DummyContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DummyContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
