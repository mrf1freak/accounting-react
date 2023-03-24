import { router } from "../trpc";
import { accountsRouter } from "./accounts";
import { productsRouter } from "./products";
import { packingRouter } from "./packing";
import { generalEntryRouter } from "./general-entry";
import { productEntryRouter } from "./product-entry";

export const appRouter = router({
  accounts: accountsRouter,
  products: productsRouter,
  packing: packingRouter,
  generalEntry: generalEntryRouter,
  productEntry: productEntryRouter,
});

export type AppRouter = typeof appRouter;
