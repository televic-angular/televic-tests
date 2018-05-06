import { Injectable } from '@angular/core';

import { SingleService } from '../../shared';

@Injectable()
export class TestBedService extends SingleService {

  value = 'value of TestBedService';

  constructor() {
    super();
  }

}
