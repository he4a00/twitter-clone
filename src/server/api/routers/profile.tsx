/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getUserPosts: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const userPosts = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        select: {
          Post: true,
          id: true,
          name: true,
          image: true,
          email: true,
        },
      });
      return userPosts;
    }),
});
