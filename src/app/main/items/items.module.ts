import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ItemsRouting} from './items.routing';
import {ItemsComponent} from './items.component';
import {LocaleService, TranslationModule, TranslationService} from 'angular-l10n';
import {SharedModule} from '../../shared/shared.module';
import { ItemsDialogComponent } from './items-dialog/items-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ItemsRouting,
    SharedModule,

    TranslationModule.forChild(),
  ],
  declarations: [
    ItemsComponent,
    ItemsDialogComponent
  ],
  entryComponents: [
    ItemsDialogComponent
  ],
})
export class ItemsModule {
  constructor(public locale: LocaleService, public translation: TranslationService) {

    this.locale.addConfiguration()
      .addLanguages(['en', 'th', 'ko'])
      .setCookieExpiration(30)
      .defineLanguage('en');
    this.translation.addConfiguration()
      .addProvider('./assets/locale/main-items/');
    this.translation.init();
  }
}
