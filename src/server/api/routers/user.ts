/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getTrendingUsers: publicProcedure.query(async ({ctx}) => {
    const trendingUsers = await ctx.prisma.user.findMany({
        orderBy: {
            likes: {
                _count: "desc"
            }
        },
        take: 3,
        select: {
            likes: true,
            name: true,
            image: true,
            id: true
        }
    })
    return trendingUsers
  })

  
});
