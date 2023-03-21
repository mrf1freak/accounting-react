import { router } from "../trpc";
import { accountsRouter } from "./accounts";
import { productsRouter } from "./products";

export const appRouter = router({
  accounts: accountsRouter,
  products: productsRouter,
});

export type AppRouter = typeof appRouter;
