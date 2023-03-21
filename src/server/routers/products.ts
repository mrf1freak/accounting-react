import { privateProcedure, router } from "server/trpc";
import { prisma } from "prisma-client";
import { z } from "zod";

export const productsRouter = router({
  all: privateProcedure.query(async () => await prisma.product.findMany()),
  create: privateProcedure
    .input(z.object({ code: z.string().min(1), name: z.string().min(1) }))
    .mutation(
      async ({ input: { name, code } }) =>
        await prisma.product.create({ data: { code, name } })
    ),
});
