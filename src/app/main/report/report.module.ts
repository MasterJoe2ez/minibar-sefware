import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocaleService, TranslationModule, TranslationService} from 'angular-l10n';
import {SharedModule} from '../../shared/shared.module';
import {ReportDialogComponent} from './report-dialog/report-dialog.component';
import {ReportComponent} from './report.component';
import {ReportRouting} from './report.routing';

@NgModule({
  imports: [
    CommonModule,
    ReportRouting,
    SharedModule,

    TranslationModule.forChild(),
  ],
  declarations: [
    ReportComponent,
    ReportDialogComponent
  ],
  entryComponents: [
    ReportDialogComponent
  ],
})
export class ReportModule {
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
