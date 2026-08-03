import { Time } from "@/lib/classes/Time";
import { describe, expect, test } from "vitest";

describe("Time Class", () => {
  test("initialization", () => {
    expect(new Time(20, 30)).toMatchObject({ hour: 20, minute: 30 });
    expect(new Time(0, 0)).toMatchObject({ hour: 0, minute: 0 });
    // @ts-expect-error
    expect(() => new Time(30, 20)).toThrow();
    // @ts-expect-error
    expect(() => new Time(-30, 200)).toThrow();
    // @ts-expect-error
    expect(() => new Time(3, 200)).toThrow();
  });

  test("toString()", () => {
    expect(Time.toString(20, 30)).toBe("20:30");
    expect(Time.toString(0, 0)).toBe("00:00");
    // @ts-expect-error
    expect(() => Time.toString(30, 20)).toThrow();
    // @ts-expect-error
    expect(() => Time.toString(-30, 200)).toThrow();
    // @ts-expect-error
    expect(() => Time.toString(3, 200)).toThrow();
  });

  test("equals()", () => {
    const timeA = new Time(10, 30);
    const timeB = new Time(10, 30);
    const timeC = new Time(11, 30);
    const timeD = new Time(10, 45);
    const timeE = new Time(23, 59);

    expect(Time.equals(timeA, timeB)).toBe(true);
    expect(Time.equals(timeA, timeA)).toBe(true);
    expect(Time.equals(timeA, timeC)).toBe(false);
    expect(Time.equals(timeA, timeD)).toBe(false);
    expect(Time.equals(timeA, timeE)).toBe(false);
  });
});
