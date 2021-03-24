import { TestBed } from '@angular/core/testing';

import { QbService } from './qb.service';

describe('QbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: QbService = TestBed.get(QbService);
    expect(service).toBeTruthy();
  });
});
