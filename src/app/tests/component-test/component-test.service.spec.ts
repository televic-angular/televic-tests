import { TestBed, inject } from '@angular/core/testing';

import { ComponentTestService } from './component-test.service';

describe('ComponentTestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComponentTestService]
    });
  });

  it('should be created', inject([ComponentTestService], (service: ComponentTestService) => {
    expect(service).toBeTruthy();
  }));
});
