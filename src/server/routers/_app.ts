import { router } from "../trpc";
import { accountsRouter } from "./accounts";

export const appRouter = router({
  accounts: accountsRouter,
});

export type AppRouter = typeof appRouter;
