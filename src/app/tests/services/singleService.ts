import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/observable/delay';
// import 'rxjs/add/operator/filter';
// import 'rxjs/add/operator/mergeMap';
// import 'rxjs/add/observable/of';

import { of } from 'rxjs/observable/of';
import { delay } from 'rxjs/operators';

import { ApiService, SingleService } from '../../shared';

@Injectable()
export class TheSingleService extends SingleService {

  // constructor() {
  //   super();
  // }

  value = 'value of theSingleService';

}
