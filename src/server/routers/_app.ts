import { procedure, router } from "../trpc";

export const appRouter = router({
  hello: procedure.query(() => "hello"),
});
 
export type AppRouter = typeof appRouter;
