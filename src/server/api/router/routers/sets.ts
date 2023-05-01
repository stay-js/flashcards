import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../../trpc';
import { SetSchema } from '@components/MutateSet';

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
  getByID: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
    try {
      const set = await ctx.prisma.set.findUnique({
        where: {
          id: input.id,
        },
        include: {
          cards: true,
          user: true,
        },
      });

      return set;
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: error });
    }
  }),
  create: protectedProcedure.input(SetSchema).mutation(async ({ ctx, input }) => {
    try {
      await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          sets: {
            create: {
              name: input.name,
              description: input.description,
              cards: {
                create: input.cards,
              },
            },
          },
        },
      });

      return { message: 'Success' };
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: error });
    }
  }),
  update: protectedProcedure.input(SetSchema).mutation(async ({ ctx, input }) => {
    if (!input.id) throw new TRPCError({ code: 'BAD_REQUEST', cause: 'No ID' });

    try {
      const set = await ctx.prisma.set.findUnique({ where: { id: input.id } });
      if (!set) throw new TRPCError({ code: 'BAD_REQUEST', cause: 'No set found' });
      if (set.userId !== ctx.session.user.id) throw new TRPCError({ code: 'UNAUTHORIZED' });

      await ctx.prisma.card.deleteMany({ where: { setId: input.id } });

      await ctx.prisma.set.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          cards: {
            create: input.cards,
          },
        },
      });

      return { message: 'Success' };
    } catch (error) {
      console.error(error);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: error });
    }
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.set.delete({ where: { id: input.id } });

        return { message: 'Success' };
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', cause: error });
      }
    }),
});
