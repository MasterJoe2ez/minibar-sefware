/**
 * Created by chaiwut on 7/18/17.
 */
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ItemsComponent} from './items.component';

const ITEMS_ROUTER: Routes = [
  {
    path: '',
    component: ItemsComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(ITEMS_ROUTER)
  ],
  exports: [
    RouterModule
  ],
  providers: [

  ]
})

export class ItemsRouting {}
