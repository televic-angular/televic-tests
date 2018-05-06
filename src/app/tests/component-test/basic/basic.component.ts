import { Component, OnInit, Input, Output, HostListener, ElementRef, Renderer, EventEmitter } from '@angular/core';

import { Celebrity } from './../../tests.model';

@Component({
  selector: 'app-basic',
  template: `
    <p (click)="click($event)">
      basic works!
    </p>
    <button (click)="clicked()">Click me!</button>
    <span>{{message}}</span>
  `,
  styles: []
})
export class BasicComponent implements OnInit {
  isOn = false;

  @Input() celebrity: Celebrity;

  @Output() selectChange = new EventEmitter();

  // @HostListener('click', ['$event.target'])
  // click(tgt: HTMLElement) {
  //   console.log('event.target:', tgt );
  //   const celebrity = this.celebrity;
  //   if (this.el.nativeElement.contains(tgt)) {
  //     this.isOn = !this.isOn;

  //     this.selectChange.emit(celebrity);
  //   }
  // }
  clicked() {
    this.isOn = !this.isOn;
  }

  click() {
    this.selectChange.emit(this.celebrity);
  }

  constructor(
    // private el: ElementRef,
    // private renderer: Renderer
  ) { }

  ngOnInit() { }

  get message() {
    return `The light is ${this.isOn ? 'On' : 'Off'}`;
  }

}
// ng g component tests/component/basic --inline-template --inline-style
