import { TestBed } from '@angular/core/testing';

import { PropertyStateService } from './property-state-service';

describe('PropertyStateService', () => {
  let service: PropertyStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PropertyStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
