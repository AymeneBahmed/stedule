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

  test("fromString()", () => {
    // Valid daytime string
    const morning = Time.fromString("10:30");
    expect(morning).not.toBeNull();
    expect(morning!.hour).toBe(10);
    expect(morning!.minute).toBe(30);

    const midnight = Time.fromString("00:00");
    const endOfDay = Time.fromString("23:59");
    expect(midnight).not.toBeNull();
    expect(midnight!.hour).toBe(0);
    expect(endOfDay).not.toBeNull();
    expect(endOfDay!.minute).toBe(59);

    // Out-of-range values
    expect(Time.fromString("24:00")).toBeNull();
    expect(Time.fromString("23:60")).toBeNull();

    // Negative values
    expect(Time.fromString("-1:30")).toBeNull();
    expect(Time.fromString("12:-15")).toBeNull();

    // Wrong format
    expect(Time.fromString("aa:bb")).toBeNull();
    expect(Time.fromString("12")).toBeNull();
    expect(Time.fromString("")).toBeNull();
  });
});
