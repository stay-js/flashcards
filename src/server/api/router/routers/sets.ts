import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../../trpc';
import { setSchema } from '@components/MutateSet';

const setSchemaWithID = setSchema.extend({
  id: z.string(),
});

export const setsRouter = router({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.set.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        _count: {
          select: {
            cards: true,
          },
        },
      },
    });
  }),
  getByID: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
    return ctx.prisma.set.findUniqueOrThrow({
      where: {
        id: input.id,
      },
      include: {
        cards: true,
        user: true,
      },
    });
  }),
  create: protectedProcedure.input(setSchema).mutation(async ({ ctx, input }) => {
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
  }),
  update: protectedProcedure.input(setSchemaWithID).mutation(async ({ ctx, input }) => {
    if (!input.id) throw new TRPCError({ code: 'BAD_REQUEST', cause: 'No ID' });

    const set = await ctx.prisma.set.findUniqueOrThrow({ where: { id: input.id } });
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
  }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.set.delete({ where: { id: input.id } });

      return { message: 'Success' };
    }),
});
