/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const profileRouter = createTRPCRouter({
  getUserPosts: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const userPosts = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        select: {
          Post: {
            select: {
              _count: true,
              content: true,
              likes: true,
              id: true,
              createdAt: true,
              retweets: true,
              user: true,
            },
          },
          id: true,
          name: true,
          image: true,
          email: true,
        },
      });
      return userPosts;
    }),

  deleteUserPost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      try {
        const post = await ctx.prisma.post.findFirst({
          where: {
            id: input.postId,
            userId,
          },
        });

        if (!post) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Post not found or user is not the owner",
          });
        }

        await ctx.prisma.post.delete({
          where: {
            id: input.postId,
          },
        });

        return { success: true, message: "Post deleted successfully" };
      } catch (error) {
        console.error("Error deleting post:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete post",
        });
      }
    }),

  AddBio: protectedProcedure
    .input(z.object({ text: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id;

      const bio = await ctx.prisma.bio.create({
        data: {
          Text: input.text,
          userId,
        },
      });

      return bio;
    }),

  getAllBio: publicProcedure.query(async ({ ctx }) => {
    const bios = await ctx.prisma.bio.findMany({
      select: {
        Text: true,
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    return bios;
  }),

  // get user retweets and display them in his profile

  getUserRetweets: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const userRetweetes = await ctx.prisma.retweet.findFirst({
        where: { userId: input.id },
        select: {
          retweetedBy: true,
          userImage: true,
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
      });

      return userRetweetes;
    }),
});
