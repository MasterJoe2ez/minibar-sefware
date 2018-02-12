import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocaleService, TranslationModule, TranslationService} from 'angular-l10n';
import {SharedModule} from '../../shared/shared.module';
import {UserDialogComponent} from './user-dialog/user-dialog.component';
import {UserComponent} from './user.component';
import {UserRouting} from './user.routing';

@NgModule({
  imports: [
    CommonModule,
    UserRouting,
    SharedModule,

    TranslationModule.forChild(),
  ],
  declarations: [
    UserComponent,
    UserDialogComponent
  ],
  entryComponents: [
    UserDialogComponent
  ],
})
export class UserModule {
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
