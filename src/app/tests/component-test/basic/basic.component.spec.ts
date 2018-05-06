import { Celebrity } from './../../tests.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef, ReflectiveInjector } from '@angular/core';

import { BasicComponent } from './basic.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('BasicComponent', () => {
  let component: BasicComponent;
  let fixture: ComponentFixture<BasicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({

      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [ BasicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('Component test basic knowledge ', () => {
  // till now , have only this method to inject ElementRef
  // const injector = ReflectiveInjector.resolveAndCreate([ElementRef]);
  // const el = injector.get(ElementRef);

  it('#clicked() toggle #isOn', () => {
    const comp = new BasicComponent();

    expect(comp.isOn).toBe(false, 'off at first');

    comp.clicked();
    expect(comp.isOn).toBe(true, 'on after click');

    comp.clicked();
    expect(comp.isOn).toBe(false, 'off after second click');
  });

  it('#clicked() should set #message to "is on"', () => {
    const comp = new BasicComponent();

    expect(comp.message).toMatch(/is off/i, 'off at first');

    comp.clicked();
    expect(comp.message).toMatch(/is on/i, 'on after clicked');
  });

  it('raises the selected event when clicked', () => {
    const comp = new BasicComponent();
    const celebrity: Celebrity = { id: 42, name: 'Test' };
    comp.celebrity = celebrity;

    comp.selectChange.subscribe(selectedCelebrity => expect(selectedCelebrity).toBe(celebrity));
    comp.click();
  });
});
