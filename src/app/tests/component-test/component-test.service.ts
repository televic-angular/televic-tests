import { Injectable } from '@angular/core';

@Injectable()
export class ComponentTestService {

  constructor() { }
  isLoggedIn = true;
  user = { name: 'Jack' };

}
