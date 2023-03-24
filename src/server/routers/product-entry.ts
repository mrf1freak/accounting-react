import { privateProcedure, router } from "server/trpc";
import { prisma } from "prisma-client";
import { z } from "zod";

export const productEntryRouter = router({
  findByDate: privateProcedure.input(z.date()).query(
    async ({ input: date }) =>
      await prisma.productEntry.findMany({
        where: { date },
        include: { account: true },
      })
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
