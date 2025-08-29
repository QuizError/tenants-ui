import { TestBed } from '@angular/core/testing';

import { UnitSectionDefinitionService } from './unit-section-definition-service';

describe('UnitSectionDefinitionService', () => {
  let service: UnitSectionDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitSectionDefinitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
