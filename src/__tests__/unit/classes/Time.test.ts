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
});
