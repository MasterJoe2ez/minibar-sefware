export class User {
  key?: string | null | undefined;
  name?: string | null | undefined;
  pin?: string | null | undefined;
  tel?: string | null | undefined;

  constructor(params: User) {
    Object.assign(this, params);
  }
}
