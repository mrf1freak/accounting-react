import { privateProcedure, router } from "server/trpc";
import { prisma } from "prisma-client";
import { z } from "zod";

export const accountsRouter = router({
  all: privateProcedure.query(async () => await prisma.account.findMany()),
  create: privateProcedure
    .input(z.object({ code: z.string().min(1), name: z.string().min(1) }))
    .mutation(
      async ({ input: { name, code } }) =>
        await prisma.account.create({ data: { code, name } })
    ),
});
