import { TestBed } from '@angular/core/testing';

import { UsersContactsService } from './users-contacts.service';

describe('UsersContactsService', () => {
  let service: UsersContactsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersContactsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
