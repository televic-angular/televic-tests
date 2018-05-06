import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  ApiService,
} from '../shared';

@Injectable()
export class TestsService {

  config = {
    fullResponse: true
  };

  constructor(
    private api: ApiService
  ) { }


}
