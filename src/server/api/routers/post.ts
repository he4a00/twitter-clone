import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  createPost: protectedProcedure.input(z.object({content: z.string() })).mutation(async({input: {content}, ctx}) => {
    const newPost = await ctx.prisma.post.create({
      data: {
        content,
        userId: ctx.session.user.id
      }
    })
    return newPost
  }),
  getAllPosts: publicProcedure.query(async({ctx}) => {
    const posts = await ctx.prisma.post.findMany({
      select: {
        content: true,
        id: true,
        createdAt: true,
        user: {
          select: {
            image: true,
            name: true,       
            id: true,
          }
        }
      }
    })
    return posts
  })
});
