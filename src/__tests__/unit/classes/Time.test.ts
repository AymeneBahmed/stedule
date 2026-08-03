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
});
