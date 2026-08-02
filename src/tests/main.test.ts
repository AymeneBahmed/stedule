import { expect, test, vi } from "vitest";
import { functionToMock } from "./test-file";

vi.mock("./test-file.ts", () => ({
  functionToMock: vi.fn(() => {
    console.log("WTF!! YOu just get mocked baby");
  }),
}));

test("2 + 2 =4", () => {
  functionToMock();
  expect(2 + 2).toBe(4);
});
