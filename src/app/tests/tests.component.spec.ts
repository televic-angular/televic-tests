import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  provideRoutes,
} from '@angular/router';

import { TestsComponent } from './tests.component';
import { BasicComponent } from './component-test/basic/basic.component';
import { ComponentTestComponent } from './component-test/component-test.component';
import { testsRoutes } from './tests-routing.module';

describe('TestsComponent', () => {
  let component: TestsComponent;
  let fixture: ComponentFixture<TestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        { // TODO RouterTestingModule.withRoutes coming soon
          ngModule: RouterTestingModule,
          providers: [provideRoutes(testsRoutes)],
        },
      ],
      declarations: [
        TestsComponent,
        ComponentTestComponent,
        BasicComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
