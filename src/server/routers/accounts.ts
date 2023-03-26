import { privateProcedure, router } from "server/trpc";
import { prisma } from "prisma-client";
import { z } from "zod";
import { withTotal } from "./product-entry";

export const accountsRouter = router({
  all: privateProcedure.query(async () => await prisma.account.findMany()),
  findByID: privateProcedure
    .input(z.number())
    .query(
      async ({ input: id }) =>
        await prisma.account.findUnique({ where: { id } })
    ),
  create: privateProcedure
    .input(z.object({ code: z.string().min(1), name: z.string().min(1) }))
    .mutation(
      async ({ input: { name, code } }) =>
        await prisma.account.create({ data: { code, name } })
    ),
  report: privateProcedure
    .input(
      z.object({
        id: z.number(),
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .query(
      async ({ input: { id, startDate, endDate } }) =>
        await getReport(id, startDate, endDate)
    ),
});

async function getReport(accountId: number, startDate: Date, endDate: Date) {
  const generalEntries = await prisma.generalEntry.findMany({
    where: {
      OR: [{ fromId: accountId }, { toId: accountId }],
    },
  });
  const productEntries = (
    await prisma.productEntry.findMany({
      where: {
        AND: [{ accountId }],
      },
      include: {
        items: { include: { packing: { include: { product: true } } } },
      },
    })
  ).map(withTotal);
  const entries = [...generalEntries, ...productEntries].sort(
    ({ date: aDate }, { date: bDate }) => aDate.valueOf() - bDate.valueOf()
  );

  let balance = 0;
  return entries
    .map((entry) => {
      if ("type" in entry) {
        return {
          id: entry.id + "-pe",
          entryId: entry.id,
          entryType: "PRODUCT" as const,
          date: entry.date,
          amount: entry.type === "SALE" ? entry.total : -entry.total,
          type: entry.type,
        };
      }
      return {
        id: entry.id + "-ge",
        entryId: entry.id,
        entryType: "GENERAL" as const,
        date: entry.date,
        amount: entry.toId == accountId ? entry.amount : -entry.amount,
        type: "PAYMENT",
      };
    })
    .map((entry) => ({
      ...entry,
      balance: (balance += entry.amount),
    }))
    .filter(({ date }) => date >= startDate && date <= endDate);
}
