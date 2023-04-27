import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../../trpc';

export const setsRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    try {
      const sets = await ctx.prisma.set.findMany({
        where: { userId: ctx.session.user.id },
      });
      return sets;
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: error });
    }
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().max(200),
        cards: z.array(z.object({ front: z.string().max(200), back: z.string().max(500) })),
      }),
    )
    .mutation(async ({ ctx, input: { name, cards } }) => {
      try {
        const set = await ctx.prisma.user.update({
          where: { id: ctx.session.user.id },
          data: { sets: { create: { name, cards: { create: cards } } } },
        });
        return set;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: error });
      }
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      try {
        const deletedSet = await ctx.prisma.set.delete({ where: { id } });
        return deletedSet;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: error });
      }
    }),
});
