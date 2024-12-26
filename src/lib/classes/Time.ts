import { Hour, Minute } from "../ts/types";

export class Time {
  hour: Hour;
  minute: Minute;

  constructor(hour: Hour, minute: Minute) {
    this.hour = hour;
    this.minute = minute;
  }
}
