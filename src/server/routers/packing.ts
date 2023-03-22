import { privateProcedure, router } from "server/trpc";
import { prisma } from "prisma-client";
import { z } from "zod";

export const packingRouter = router({
  create: privateProcedure
    .input(
      z.object({
        size: z.number().min(1).int(),
        quantity: z.number().int(),
        productId: z.number(),
      })
    )
    .mutation(
      async ({ input: { size, quantity, productId } }) =>
        await prisma.packing.create({
          data: { size, quantity, product: { connect: { id: productId } } },
        })
    ),
});
