/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
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

  // get trending posts based on likes 

  getTrendingPosts: publicProcedure.query(async({ctx}) => {
    const posts = await ctx.prisma.post.findMany({
      orderBy: {
        likes:{
          _count: "desc"
        }
      },
      take: 10,
      select: {
        content: true,
        id: true,
        likes:true,
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

  // retweet feature

  retweetPost: protectedProcedure.input(z.object({id: z.string()})).mutation(async({input, ctx}) => {
    const userId = ctx.session.user.id
    const username = ctx.session.user.name
    const image = ctx.session.user.image

    const existingRewtweet = await ctx.prisma.retweet.findUnique({
      where:
      {
        userId_postId: { userId, postId: input.id }
      } 
    })

    

    if(existingRewtweet == null) {
      const createdRetweet = await ctx.prisma.retweet.create({data: {userId, postId: input.id, retweetedBy: username, userImage: image}})
       return {addedRetweet: true, createdRetweet}
     } else {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You Already Retweeted this post",
      });
     }

    
  }),

  // get all rewtweets 

  getAllRetweets: publicProcedure.query(async({ctx}) => {
    const retweets = await ctx.prisma.retweet.findMany({
      orderBy: {
        post : {
          retweets: {
            _count: "desc"
          }
        }
      },
      select: {
        retweetedBy: true,
        userImage: true,
        post: {
          select: {
            content: true,
            id: true,
            likes:true,
            createdAt: true,
            user: {
              select: {
                image: true,
                name: true,       
                id: true,
              }
            }
          }
        }
      }
    })
    return retweets
  }),

  addtoSavedPosts: protectedProcedure.input(z.object({id: z.string()})).mutation(async({input, ctx}) => {
    const userId = ctx.session.user.id
   
    const existingSaved = await ctx.prisma.savedPosts.findUnique({
      where:
      { 
        userId_postId: {userId, postId: input.id}
      } 
    })


    if(existingSaved == null) {
      const createdSavedPost = await ctx.prisma.savedPosts.create({data: {postId: input.id, userId: userId}})
       return {addedSaved: true, createdSavedPost}
     } else { 
        await ctx.prisma.savedPosts.delete({where: {userId_postId: {postId: input.id, userId: userId}}})
        return {addedSaved: false}
     }
    
  }),


  getSavedPosts: protectedProcedure.input(z.object({ id: z.string() })).query(async({input, ctx}) => {
    const savedPosts = await ctx.prisma.savedPosts.findFirst({
      where: {userId: input.id}, 
      select: {
        post: {
          select: {
            content: true,
            id: true,
            likes: true,
            createdAt: true,
            user: {
              select: {
                image: true,
                name: true,
                id: true,
              },
            },
          },
        },
      },
    
    })
    return savedPosts
  })

});
