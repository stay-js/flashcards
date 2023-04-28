import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../../trpc';
import { SetSchema } from '@pages/create';

export const setsRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    try {
      const sets = await ctx.prisma.set.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          _count: {
            select: { cards: true },
          },
        },
      });
      return sets;
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: error });
    }
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      try {
        const set = await ctx.prisma.set.findUnique({ where: { id }, include: { cards: true } });
        return set;
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: error });
      }
    }),
  create: protectedProcedure
    .input(SetSchema)
    .mutation(async ({ ctx, input: { name, description, cards } }) => {
      try {
        const set = await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            sets: {
              create: {
                name,
                description,
                cards: {
                  create: cards,
                },
              },
            },
          },
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
