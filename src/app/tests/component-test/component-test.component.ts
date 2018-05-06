import { Celebrity } from './../tests.model';
import { Component, OnInit } from '@angular/core';

import { ComponentTestService } from './component-test.service';

@Component({
  selector: 'app-component',
  templateUrl: './component-test.component.html',
  styleUrls: ['./component-test.component.sass']
})
export class ComponentTestComponent implements OnInit {

  celebrity: Celebrity;
  welcome: string;

  constructor(
    private serivce: ComponentTestService
  ) {
    this.celebrity = ({
      id: 1,
      name: 'rockwang',
      reputation: 1000,
      age: 35,
    } as Celebrity);
  }

  onBasicSelected($event) {
    console.log('onBasicSelected:', $event);
  }

  ngOnInit() {
    this.welcome = this.serivce.isLoggedIn ?
      'Welcome, ' + this.serivce.user.name :
        'Please log in.';
  }

}
