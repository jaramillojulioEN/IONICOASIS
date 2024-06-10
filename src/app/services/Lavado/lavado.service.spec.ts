import { TestBed } from '@angular/core/testing';

import { LavadoService } from './lavado.service';

describe('LavadoService', () => {
  let service: LavadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LavadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
