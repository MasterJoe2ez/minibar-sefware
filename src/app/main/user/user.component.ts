import {Component, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatSnackBar} from '@angular/material';
import {Page} from '../../shared/model/page';
import {Language} from 'angular-l10n';
import {ConfirmComponent} from '../../dialog/confirm/confirm.component';
import {TdLoadingService, TdMediaService} from '@covalent/core';
import {SelectionModel} from '@angular/cdk/collections';
import {UserService} from './user.service';
import {UserDialogComponent} from './user-dialog/user-dialog.component';
import {User} from './user';
import { LogsDialogComponent } from '../../dialog/logs-dialog/logs-dialog.component';
import { Logs } from '../../dialog/logs-dialog/logs';
import { LogsService } from '../../dialog/logs-dialog/logs.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [UserService, LogsService]
})
export class UserComponent implements OnInit {

  @Language() lang: string;
  @ViewChild('dataTable') table: any;

  loading: boolean = true;

  page = new Page();
  cache: any = {};
  expanded: any = {};

  rows: any[] = [];
  temp = [];

  constructor(private _userService: UserService,
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
    this._userService.requestData().subscribe((snapshot) => {
      this._userService.rows = [];
      snapshot.forEach((s) => {

        const _row = new User(s.val());
        this._userService.rows.push(_row);

      });

      this.temp = [...this._userService.rows];
      this.loading = false;
      this.setPage(null);
    });
  }

  setPage(pageInfo) {

    if (pageInfo) {
      this.page.pageNumber = pageInfo.pageIndex;
      this.page.size = pageInfo.pageSize;
    }

    this._userService.getResults(this.page).subscribe((pagedData) => {
      this.page = pagedData.page;
      this.rows = pagedData.data;
    });

  }

  addData() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
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

  editData(data: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
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

  deleteData(data: User) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'delete',
        title: 'Delete item type',
        content: 'Confirm to delete?',
        data_title: 'Item Type',
        data: data.key + ' : ' + data.name
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._userService.removeData(data).then(() => {
          this.snackBar.open('Delete item type succeed.', '', {duration: 3000});
          this.addLog('Delete', 'delete item type succeed', data, {});

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });
  }

  enableData(data: User) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'enable',
        title: 'Enable item type',
        content: 'Item type with enabled will be able to use',
        data_title: 'Item Type',
        data: data.key + ' : ' + data.name
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._userService.updateDataStatus(data, false).then(() => {
          this.snackBar.open('Enable item type succeed', '', {duration: 3000});

          const new_data = new User(data);
          // new_data.disable = false;
          this.addLog('Enable', 'enable item type succeed', new_data, data);

        }).catch((err) => {
          this.snackBar.open('Error : ' + err.message, '', {duration: 3000});
        });
      }
    });

  }

  disableData(data: User) {
    this.dialog.open(ConfirmComponent, {
      data: {
        type: 'disable',
        title: 'Disable item type',
        content: 'Item type with disabled are not able to use',
        data_title: 'Item Type',
        data: data.key + ' : ' + data.name
      }
    }).afterClosed().subscribe((confirm: boolean) => {
      if (confirm) {
        this.snackBar.dismiss();
        this._userService.updateDataStatus(data, true).then(() => {
          this.snackBar.open('Disable item type succeed', '', {duration: 3000});

          const new_data = new User(data);
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

  openLogs(data: User) {
    this.dialog.open(LogsDialogComponent, {
      disableClose: true,
      maxWidth: '100vw',
      width: '100%',
      height: '100%',
      data: {
        menu: 'Item Type',
        path: this._userService.getPath(),
        ref: data ? data.key : null
      },
    });
  }

  addLog(operation: string, description: string, data: any, old: any): void {
    const log = new Logs({});
    log.path = this._userService.getPath();
    log.ref = data.code;
    log.operation = operation;
    log.description = description;
    log.old_data = old;
    log.new_data = data;
    this._logService.addLog(this._userService.getPath(), log);
  }

  openLink(link: string) {
    window.open(link, '_blank');
  }

}
