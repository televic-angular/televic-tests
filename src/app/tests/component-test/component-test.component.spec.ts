import { Celebrity } from './../tests.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ComponentTestComponent } from './component-test.component';
import { ComponentTestService } from './component-test.service';
import { BasicComponent } from './basic/basic.component';

describe('Component basic tests(with testbed)', () => {
  let component: ComponentTestComponent;
  let fixture: ComponentFixture<ComponentTestComponent>;
  let componentTestService: ComponentTestService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        ComponentTestComponent,
        // BasicComponent
      ],
      providers: [
        // ComponentTestComponent,
        {
          provide: ComponentTestService,
          useClass: class MockComponentTestService {
            isLoggedIn = true;
            user = { name: 'Test User' };
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    // component = TestBed.get(ComponentTestComponent);
    componentTestService = TestBed.get(ComponentTestService);
  });

  it('should create', () => {
    /* TestBed.configureTestingModule({
      declarations: [ComponentTestComponent]
    });
    const fixture = TestBed.createComponent(ComponentTestComponent);
    const comp = fixture.componentInstance;
    expect(comp).toBeTruthy(); */
    // expect(comp).toBeDefined();
  });

/*   it('should not have welcome message after construction', () => {
    expect(component.welcome).toBeUndefined();
  }); */

  it('should welcome logged in user after Angular calls ngOnInit', () => {
    component.ngOnInit();
    expect(component.welcome).toContain(componentTestService.user.name);
  });

  it('should ask user to log in if not logged in after ngOnInit', () => {
    componentTestService.isLoggedIn = false;
    component.ngOnInit();
    expect(component.welcome).not.toContain(componentTestService.user.name);
    expect(component.welcome).toContain('log in');
  });

});
