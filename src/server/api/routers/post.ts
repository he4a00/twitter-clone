/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
      orderBy: {
        createdAt: "desc"
      },
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
  }),

  toggleLike: protectedProcedure.input(z.object({id: z.string()})).mutation(async ({input: {id}, ctx}) => {
    const data = {postId: id, userId: ctx.session.user.id}
    const existingLike = await ctx.prisma.postLike.findUnique(
      {
        where: {
      userId_postId: data
    }
  })
    if(existingLike == null) {
     const createdLike = await ctx.prisma.postLike.create({data})
      return {addedLike: true, like: createdLike}
    } else {
      await ctx.prisma.postLike.delete({where: {userId_postId :data}})
      return {addedLike: false}
    }
   
  }),

  getLikes: publicProcedure.query(async({ctx}) => {
    const likes = await ctx.prisma.postLike.findMany()
    return likes
  }),

});
