import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/router';
import SuperJSON from 'superjson';
import { prisma } from '~/server/db';

export const ssg = createServerSideHelpers({
  router: appRouter,
  ctx: { prisma, session: null },
  transformer: SuperJSON,
});
