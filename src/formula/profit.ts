export function createProfitTable<
  T extends { amount: number; rate: number; type: "Purchase" | "Sale" }[]
>(data: T) {
  const table: (T[number] & {
    totalValue: number;
    totalAmount: number;
    totalRate: number;
    profit: number;
  })[] = [];
  let totalAmount = 0;
  let totalValue = 0;

  for (const { amount, rate, type, ...rest } of data) {
    const value = rate * amount;
    const totalRate = () => (totalAmount <= -1 ? 0 : totalValue / totalAmount);
    const valuesToAdd = () => ({
      type,
      amount,
      rate,
      value,
      totalValue,
      totalAmount,
      totalRate: totalRate(),
      profit: 0,
      ...rest,
    });
    if (type == "Purchase") {
      totalAmount += amount;
      totalValue += value;
      table.push(valuesToAdd());
    }
    if (type == "Sale") {
      const tempRate = totalRate();
      const profit = (rate - tempRate) * amount;
      totalAmount -= amount;
      totalValue = tempRate * totalAmount;
      table.push({ ...valuesToAdd(), profit });
    }
  }

  return table;
}
