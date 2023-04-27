import { router } from '../trpc';
import { setsRouter } from './routers/sets';

export const appRouter = router({
  sets: setsRouter,
});

export type AppRouter = typeof appRouter;
