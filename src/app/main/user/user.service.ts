import {Injectable} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database-deprecated';
import {User} from './user';
import {Page} from '../../shared/model/page';
import {Observable} from 'rxjs';
import {PagedData} from '../../shared/model/paged-data';

@Injectable()
export class UserService {

  lists: FirebaseListObservable<any>;
  rows: User[] = [];
  _path: string = '/users';

  constructor(private agFb: AngularFireDatabase) {
    this.lists = agFb.list(this._path, {preserveSnapshot: true});
  }

  getPath(): string {
    return this._path;
  }

  requestData() {
    return this.lists;
  }

  requestDataByCode(code: string) {
    return this.agFb.object(this._path + '/' + code);
  }

  addData(data: User) {
    return this.lists.update(data.key, data);
  }

  updateData(data: User) {
    return this.lists.update(data.key, data);
  }

  updateDataStatus(data: User, active: boolean) {
    return this.lists.update(data.key, {
      disable: active
    });
  }

  removeData(data: User) {
    return this.lists.remove(data.key);
  }

  requestLastData() {
    return this.agFb.list(this._path, {
      query: {
        limitToLast: 1
      }
    });
  }

  public getResults(page: Page): Observable<PagedData<User>> {
    return Observable.of(this.rows).map((data) => this.getPagedData(page));
  }

  private getPagedData(page: Page): PagedData<User> {
    const pagedData = new PagedData<User>();
    page.totalElements = this.rows.length;
    page.totalPages = page.totalElements / page.size;
    const start = page.pageNumber * page.size;
    const end = Math.min((start + page.size), page.totalElements);
    for (let i = start; i < end; i++) {
      const jsonObj = this.rows[i];
      pagedData.data.push(new User(jsonObj));
    }
    pagedData.page = page;
    return pagedData;
  }

}
