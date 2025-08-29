import { TestBed } from '@angular/core/testing';

import { UnitSectionService } from './unit-section-service';

describe('UnitSectionService', () => {
  let service: UnitSectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitSectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
