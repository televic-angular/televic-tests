import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TestsComponent } from './tests/tests.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const appRoutes: Routes = [
  // {
  //   path: 'tests',
  //   // component: TestsComponent
  //   // loadChildren: './tests/tests.module#TestsModule',
  //   loadChildren: 'app/tests/tests.module#TestsModule',
  // },
  // { path: '', redirectTo: '/tests', pathMatch: 'full' },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
