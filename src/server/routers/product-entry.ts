import { privateProcedure, router } from "server/trpc";
import { prisma } from "prisma-client";
import { z } from "zod";
import { add } from "lodash";

function itemWithTotal<
  T extends { quantity: number; price: number; packing: P },
  P extends { size: number }
>(item: T) {
  return {
    ...item,
    total: item.quantity * item.price * item.packing.size,
  };
}
export const productEntryRouter = router({
  findByDate: privateProcedure.input(z.date()).query(
    async ({ input: date }) =>
      await prisma.productEntry.findMany({
        where: { date },
        include: { account: true },
      })
  ),
  findByID: privateProcedure.input(z.number()).query(async ({ input: id }) =>
    withTotal(
      await prisma.productEntry.findUnique({
        where: { id },
        include: {
          account: true,
          items: {
            include: { packing: { include: { product: true } } },
          },
        },
      })
    )
  ),
  create: privateProcedure
    .input(
      z.object({
        date: z.date(),
        additionalCharges: z.number().min(0).int(),
        description: z.string(),
        accountId: z.number(),
        type: z.enum(["PURCHASE", "SALE"]),
        items: z.array(
          z.object({
            productId: z.number(),
            packingId: z.number(),
            quantity: z.number().min(0).int(),
            price: z.number().min(0).int(),
          })
        ),
      })
    )
    .mutation(
      async ({
        input: { date, additionalCharges, description, accountId, type, items },
      }) =>
        await prisma.productEntry.create({
          data: {
            date,
            additionalCharges,
            description,
            type,
            account: { connect: { id: accountId } },
            user: { connect: { id: 1 } },
            items: {
              createMany: { data: items },
            },
          },
        })
    ),
});

function withTotal<
  E extends {
    items: { quantity: number; price: number; packing: P }[];
  },
  P extends { size: number }
>(productEntry: E | null) {
  if (productEntry == null) return null;
  const itemsWithTotal = productEntry.items.map(itemWithTotal);
  return {
    ...productEntry,
    items: itemsWithTotal,
    total: itemsWithTotal.map(({ total }) => total).reduce(add, 0),
  };
}
