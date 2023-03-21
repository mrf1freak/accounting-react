import { router } from "../trpc";
import { accountsRouter } from "./accounts";
import { productsRouter } from "./products";
import { generalEntryRouter } from "./general-entry";

export const appRouter = router({
  accounts: accountsRouter,
  products: productsRouter,
  generalEntry: generalEntryRouter,
});

export type AppRouter = typeof appRouter;
