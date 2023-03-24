import { privateProcedure, router } from "server/trpc";
import { prisma } from "prisma-client";
import { z } from "zod";

export const generalEntryRouter = router({
  findByDate: privateProcedure.input(z.date()).query(
    async ({ input: date }) =>
      await prisma.generalEntry.findMany({
        where: { date },
        include: { from: true, to: true },
      })
  ),
  create: privateProcedure
    .input(
      z.object({
        date: z.date(),
        amount: z.number(),
        description: z.string(),
        toId: z.number(),
        fromId: z.number(),
      })
    )
    .mutation(
      async ({ input: { date, amount, description, toId, fromId } }) =>
        await prisma.generalEntry.create({
          data: {
            date,
            amount,
            description,
            to: { connect: { id: toId } },
            from: { connect: { id: fromId } },
            user: { connect: { id: 1 } },
          },
        })
    ),
});
