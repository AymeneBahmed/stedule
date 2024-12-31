import { Hour, Minute } from "../ts/types";

export class Time {
  hour: Hour;
  minute: Minute;

  constructor(hour: Hour, minute: Minute) {
    this.hour = hour;
    this.minute = minute;
  }

  static fromString(time: string): Time | null {
    const [hour, min] = time.split(":").map(Number);

    if (
      !isNaN(hour!) &&
      !isNaN(min!) &&
      hour! >= 0 &&
      hour! <= 23 &&
      min! >= 0 &&
      min! <= 59
    ) {
      return new Time(hour as Hour, min as Minute);
    }

    return null;
  }
}
