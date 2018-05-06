import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestsComponent } from './tests.component';

import { TestsRoutingModule } from './tests-routing.module';
import { ComponentTestComponent } from './component-test/component-test.component';
import { BasicComponent } from './component-test/basic/basic.component';

@NgModule({
  imports: [
    CommonModule,
    TestsRoutingModule
  ],
  declarations: [
    TestsComponent,
    ComponentTestComponent,
    BasicComponent,
  ]
})
export class TestsModule { }
