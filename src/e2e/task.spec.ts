import { expect, test } from "@playwright/test";

test("CRUD task", async ({ page }) => {
  await page.goto("/");

  const firstEmptyCell = page.locator("tbody td").nth(1);
  await firstEmptyCell.click();

  const newTaskFormLabels = page.locator("#new-task-form label");

  await newTaskFormLabels.nth(0).locator("+ input").fill("Cook Spaghetti");
  await newTaskFormLabels.nth(1).locator("+ button").click();
  await page.locator("#day-selector div div").nth(5).click();
  await newTaskFormLabels.nth(2).locator("+ input").fill("2242");
  await newTaskFormLabels.nth(3).locator("+ button").click();
  await page.locator("#priority-selector div div").nth(3).click();
  await newTaskFormLabels
    .nth(4)
    .locator("+ textarea")
    .fill("Create saunce that will benefit all humanity");

  await page.getByRole("button", { name: "Submit" }).click();
  await page.waitForTimeout(1000);

  await expect(firstEmptyCell).not.toHaveText("Cook Spaghetti");

  // Note that the seperator between AM and PM hours is considered a tr element
  const scheduleBodyTrElements = page.locator("tbody tr");

  // check if 22:42 was added to the table
  await expect(scheduleBodyTrElements).toHaveCount(10);

  const newTaskCell = scheduleBodyTrElements.last().locator("td").nth(6);

  await expect(newTaskCell).toHaveText("Cook Spaghetti");
  await newTaskCell.click();

  await Promise.all([
    expect(page.getByText("Edit Mode")).toBeVisible(),
    expect(page.getByText("name: Cook Spaghetti")).toBeVisible(),
    expect(page.getByText("priority: High")).toBeVisible(),
    expect(
      page.getByText(
        "description: Create saunce that will benefit all humanity",
      ),
    ).toBeVisible(),

    // expect form to have old details in its fields
    expect(page.getByRole("textbox", { name: "Task" })).toHaveValue(
      "Cook Spaghetti",
    ),
    expect(page.getByRole("combobox", { name: "Day" })).toHaveText("Friday"),
    expect(page.getByRole("textbox", { name: "Time" })).toHaveValue("22:42"),
    expect(
      page.getByRole("combobox", { name: "Priority (Optional)" }),
    ).toHaveText("High"),
    expect(
      page.getByRole("textbox", { name: "Description (Optional)" }),
    ).toHaveValue("Create saunce that will benefit all humanity"),
  ]);

  await page
    .getByRole("textbox", { name: "Description (Optional)" })
    .fill("Add something special");

  await page.getByRole("button", { name: "Edit" }).click();

  // Check the updated description of the same cell
  await newTaskCell.click();
  await Promise.all([
    expect(page.getByText("Edit Mode")).toBeVisible(),
    expect(page.getByText("name: Cook Spaghetti")).toBeVisible(),
    expect(page.getByText("priority: High")).toBeVisible(),
    expect(page.getByText("description: Add something special")).toBeVisible(),

    // expect form to have old details in its fields
    expect(page.getByRole("textbox", { name: "Task" })).toHaveValue(
      "Cook Spaghetti",
    ),
    expect(page.getByRole("combobox", { name: "Day" })).toHaveText("Friday"),
    expect(page.getByRole("textbox", { name: "Time" })).toHaveValue("22:42"),
    expect(
      page.getByRole("combobox", { name: "Priority (Optional)" }),
    ).toHaveText("High"),
    expect(
      page.getByRole("textbox", { name: "Description (Optional)" }),
    ).toHaveValue("Add something special"),
  ]);
});
