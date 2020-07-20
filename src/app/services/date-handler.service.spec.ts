import { TestBed } from '@angular/core/testing';

import { DateHandlerService } from './date-handler.service';

describe('DateHandlerService', () => {
  let service: DateHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
