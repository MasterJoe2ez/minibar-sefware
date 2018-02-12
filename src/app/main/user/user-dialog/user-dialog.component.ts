import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog, MatFormFieldModule} from '@angular/material';
import {GalleryConfig, /*GalleryService*/} from 'ng-gallery';
import {Upload} from '../../../shared/model/upload';
import {UploadService} from '../../../services/upload.service';
import {Language} from 'angular-l10n';
import {TdLoadingService} from '@covalent/core';
import {UserService} from '../user.service';
import {User} from '../user';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
  providers: [UserService]

})
export class UserDialogComponent implements OnInit {

  @Language() lang: string;

  data: User = new User({});
  disableSelect = new FormControl(true);
  error: any;
  images = [];
  storage_ref = '/main/settings/item_type';

  constructor(@Inject(MAT_DIALOG_DATA) public md_data: User,
              private _itemtypeService: UserService,
              private _loadingService: TdLoadingService,
              public dialogRef: MatDialogRef<UserDialogComponent>) {

    try {
      if (md_data) {
        this.data = new User(md_data);
        // this.disableSelect = new FormControl(this.data.disableSelect);
        /*if (!this.data.image) {
          this.displayImage('../../../../../assets/images/user.png');
        } else {
          this.displayImage(this.data.image);
        }*/

      } else {
        // this.displayImage('../../../../../assets/images/user.png');
        this._itemtypeService.requestData().subscribe(() => {
          this.generateCode();
        });
      }
    } catch (error) {
      this.error = error;
    }
  }

  ngOnInit(): void {
  }

  generateCode() {
    this._loadingService.register('data.form');
    const prefix = 'USER';
    this.data.key = prefix + '-001';
    // this.data.code = '1';
    this._itemtypeService.requestLastData().subscribe((s) => {
      s.forEach((ss: User) => {
        console.log('Prev Code :' + ss.key);
        //tslint:disable-next-line:radix
        const str = parseInt(ss.key.substring(ss.key.length - 1, ss.key.length)) + 1;
        // const last = '' + str;

        let last = prefix + '-' + str;

        if (str < 100) {
          last = prefix + '-0' + str;
        }

        if (str < 10) {
          last = prefix + '-00' + str;
        }

        this.data.key = last;
      });
      this._loadingService.resolve('data.form');
    });
  }

  saveData(form) {

    if (form.valid) {

      this.error = false;
      this._loadingService.register();

      this.data.name = form.value.name ? form.value.name : null;
      this.data.pin = form.value.pin ? form.value.pin : null;
      this.data.tel = form.value.tel ? form.value.tel : null;

      if (this.md_data) {
        if (_.isEqual(this.data, this.md_data)) {
          this.dialogRef.close(false);
        } else {
          this._itemtypeService.updateData(this.data).then(() => {
            this.dialogRef.close(this.data);
            this._loadingService.resolve();
          }).catch((err) => {
            this.error = err.message;
            this._loadingService.resolve();
          });
        }
      } else {
        this._itemtypeService.addData(this.data).then(() => {
          this.dialogRef.close(this.data);
          this._loadingService.resolve();
        }).catch((err) => {
          this.error = err.message;
          this._loadingService.resolve();
        });
      }
    }
  }

  // disableSelectChange() {
  //   this.data.disableSelect = this.disableSelect.value;
  //   console.log('Func Active is : ' + this.data.disableSelect);
  // }

  openLink(link: string) {
    window.open(link, '_blank');
  }

}
