import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TestsComponent } from './tests.component';
import { ComponentTestComponent } from './component-test/component-test.component';

export const testsRoutes: Routes = [
  {
    path: 'tests',
    component: TestsComponent,
    children: [
      {
        path: 'component-test',
        component: ComponentTestComponent
      },
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(testsRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class TestsRoutingModule { }
