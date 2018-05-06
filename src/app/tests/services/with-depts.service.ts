import { Injectable } from '@angular/core';

import { TheSingleService as SingleService } from './singleService';

@Injectable()
export class WithDeptsService {

  constructor(private singleService: SingleService) { }

  getValue() {
    return this.singleService.getValue();
  }

}
