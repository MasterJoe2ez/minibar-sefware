/**
 * Created by chaiwut on 7/18/17.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportComponent} from './report.component';

const REPORT_ROUTER: Routes = [
  {
    path: '',
    component: ReportComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(REPORT_ROUTER)
  ],
  exports: [
    RouterModule
  ],
  providers: [

  ]
})

export class ReportRouting {}
