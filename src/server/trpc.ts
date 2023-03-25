import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { getSession } from "next-auth/react";
import { CreateNextContextOptions } from "@trpc/server/src/adapters/next";

export const createContext = async (opts: CreateNextContextOptions) => {
  const session = await getSession({ req: opts.req });
  return {
    session,
  };
};

const t = initTRPC
  .context<typeof createContext>()
  .create({ transformer: superjson });
export const middleware = t.middleware;

const isLoggedIn = middleware(async ({ ctx, next }) => {
  if (!ctx.session?.user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx,
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isLoggedIn);
