import { Context } from "@jcel/utils";

export class Cell {
  constructor(
    public formula?: (temporary?: Context | undefined) => Promise<any>,
    public value?: any,
  ) {}
}
