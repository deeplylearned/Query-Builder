import { TestBed } from '@angular/core/testing';

import { VlfwQbService } from './vlfw-qb.service';

describe('VlfwQbService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VlfwQbService = TestBed.get(VlfwQbService);
    expect(service).toBeTruthy();
  });
});
