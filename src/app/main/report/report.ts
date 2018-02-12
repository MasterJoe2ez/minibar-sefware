export class Report {
  room?: string | null | undefined;
  // key?: string | null | undefined;
  item?: string | null | undefined;
  amount?: string | null | undefined;
  time?: string | null | undefined;
  user?: string | null | undefined;

  constructor(params: Report) {
    Object.assign(this, params);
  }
}
