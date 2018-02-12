export class Items {
  code?: string = 'N/A';
  name?: string | null | undefined;
  amount?: string | null | undefined;
  sell?: string | null | undefined;
  cost?: string | null | undefined;

  constructor(params: Items) {
    Object.assign(this, params);
  }
}
