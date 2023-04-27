// ┌─────────┬────────────┬────────┬──────┬───────┬───────────────────┬─────────────┬────────────────────┬────────────────────┐
// │ (index) │    type    │ amount │ rate │ value │    totalValue     │ totalAmount │     totalRate      │       profit       │
// ├─────────┼────────────┼────────┼──────┼───────┼───────────────────┼─────────────┼────────────────────┼────────────────────┤
// │    0    │ 'Purchase' │   10   │  1   │  10   │        10         │     10      │         1          │         0          │
// │    1    │ 'Purchase' │   20   │ 1.2  │  24   │        34         │     30      │ 1.1333333333333333 │         0          │
// │    2    │   'Sale'   │   15   │ 1.5  │ 22.5  │        17         │     15      │ 1.1333333333333333 │        5.5         │
// │    3    │ 'Purchase' │   30   │ 1.3  │  39   │        56         │     45      │ 1.2444444444444445 │         0          │
// │    4    │   'Sale'   │   10   │ 1.6  │  16   │ 43.55555555555556 │     35      │ 1.2444444444444445 │ 3.5555555555555562 │
// │    5    │   'Sale'   │   35   │ 1.55 │ 54.25 │         0         │      0      │         0          │ 10.694444444444445 │
// └─────────┴────────────┴────────┴──────┴───────┴───────────────────┴─────────────┴────────────────────┴────────────────────┘

import { createProfitTable } from "./profit";

const data: { amount: number; rate: number; type: "Purchase" | "Sale" }[] = [
  { amount: 10, rate: 1, type: "Purchase" },
  { amount: 20, rate: 1.2, type: "Purchase" },
  { amount: 15, rate: 1.5, type: "Sale" },
  { amount: 30, rate: 1.3, type: "Purchase" },
  { amount: 10, rate: 1.6, type: "Sale" },
  { amount: 35, rate: 1.55, type: "Sale" },
];

describe("create profit table", () => {
  const table = createProfitTable(data);

  test("total profit should be 19.75", () => {
    const totalProfit = table
      .map(({ profit }) => profit)
      .reduce((a, b) => a + b, 0);

    expect(totalProfit).toBe(19.75);
  });

  test("profit of first sale should be 5.5", () => {
    expect(table[2].profit).toBe(5.5);
  });
});
