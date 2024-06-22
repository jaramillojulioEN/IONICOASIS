import { TestBed } from '@angular/core/testing';

import { CortesService } from './cortes.service';

describe('CortesService', () => {
  let service: CortesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CortesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
