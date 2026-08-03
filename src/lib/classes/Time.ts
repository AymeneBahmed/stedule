import { Hour, Minute } from "../ts/types";

export class Time {
  hour: Hour;
  minute: Minute;

  constructor(hour: Hour, minute: Minute) {
    if (hour < 0 || hour > 23 || minute < 0 || minute > 60) {
      throw new Error("Time constructor received invalid time parameters");
    }

    this.hour = hour;
    this.minute = minute;
  }

  static toString(hour: Hour, minute: Minute): string {
    if (hour < 0 || hour > 23 || minute < 0 || minute > 60) {
      throw new Error("Invalid time parameters");
    }

    return `${hour < 10 ? "0" : ""}${hour}:${minute < 10 ? "0" : ""}${minute}`;
  }

  static equals(a: Time, b: Time): boolean {
    return a.hour === b.hour && a.minute === b.minute;
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
