import {Component, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatSnackBar} from '@angular/material';
import {Page} from '../../shared/model/page';
import {Language} from 'angular-l10n';
import {ConfirmComponent} from '../../dialog/confirm/confirm.component';
import {TdLoadingService, TdMediaService} from '@covalent/core';
import {SelectionModel} from '@angular/cdk/collections';
import {ReportService} from './report.service';
import {ReportDialogComponent} from './report-dialog/report-dialog.component';
import {Report} from './report';
import { LogsDialogComponent } from '../../dialog/logs-dialog/logs-dialog.component';
import { Logs } from '../../dialog/logs-dialog/logs';
import { LogsService } from '../../dialog/logs-dialog/logs.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  providers: [ReportService, LogsService]
})
export class ReportComponent implements OnInit {

  @Language() lang: string;
  @ViewChild('dataTable') table: any;

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  rows: any[] = [];
  temp = [];

  constructor(private _itemsService: ReportService,
              private _logService: LogsService,
              public media: TdMediaService,
              public snackBar: MatSnackBar,
              private dialog: MatDialog) {

    this.page.size = 10;
    this.page.pageNumber = 0;

  }
  ngOnInit(): void {
    this.load();
  }

  load() {
    this.loading = true;
    this._itemsService.requestData().subscribe((snapshot) => {
      this._itemsService.rows = [];
      snapshot.forEach((s) => {

        const _row = new Report(s.val());
        this._itemsService.rows.push(_row);

      });

      this.temp = [...this._itemsService.rows];
      this.loading = false;
      this.setPage(null);
    });
  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._itemsService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }

  addData() {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vw',
      width: '25%'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  editData(data: Report) {
    const dialogRef = this.dialog.open(ReportDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      maxHeight: '100vw',
      width: '25%',
      data
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        // this.msgs = [];
        // this.msgs.push({severity: 'success', detail: 'Data updated'});
      }
    });
  }

  deleteData(data: Report) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'delete',
        title: 'Delete Items',
        content: 'Confirm to delete?',
        data_title: 'Items',
        data: data.room + ' : ' + data.item
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._itemsService.removeData(data).then(() => {
          this.snackBar.open('Delete items succeed.', '', {duration: 3000});
          this.addLog('Delete', 'delete items succeed', data, {});

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  enableData(data: Report) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'enable',
        title: 'Enable item type',
        content: 'Item type with enabled will be able to use',
        data_title: 'Item Type',
        data: data.room + ' : ' + data.item
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._itemsService.updateDataStatus(data, false).then(() => {
          this.snackBar.open('Enable item type succeed', '', {duration: 3000});

          const new_data = new Report(data);
          // new_data.disable = false;
          this.addLog('Enable', 'enable item type succeed', new_data, data);

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });

  }

  disableData(data: Report) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'disable',
        title: 'Disable item type',
        content: 'Item type with disabled are not able to use',
        data_title: 'Item Type',
        data: data.room + ' : ' + data.item
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._itemsService.updateDataStatus(data, true).then(() => {
          this.snackBar.open('Disable item type succeed', '', {duration: 3000});

          const new_data = new Report(data);
          // new_data.disable = false;
          this.addLog('Disable', 'disable item type succeed', new_data, data);

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  updateFilter(event) {
    if (event === '') {
      this.setPage(null);
      return;
    }

    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function(d) {
      return (d.code.toLowerCase().indexOf(val) !== -1) ||
        (d.name1 && d.name1.toLowerCase().indexOf(val) !== -1) ||
        (d.name2 && d.name2.toLowerCase().indexOf(val) !== -1)
        || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  openLogs(data: Report) {
    this.dialog.open(LogsDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
      data: {
        menu: 'Items',
        path: this._itemsService.getPath(),
        ref: data ? data.room : null
      },
    });
  }

  addLog(operation: string, description: string, data: any, old: any): void {
    const log = new Logs({});
    log.path = this._itemsService.getPath();
    log.ref = data.code;
    log.operation = operation;
    log.description = description;
    log.old_data = old;
    log.new_data = data;
    this._logService.addLog(this._itemsService.getPath(), log);
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }
}
