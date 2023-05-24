/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { api } from "~/utils/api";
import { useState, useEffect } from "react";
import ProfileImage from "./ProfileImage";
import Link from "next/link";
import HeartButton from "./HeartButton";

type PostProps = {
  id: string;
  user: { id: string; image: string | null; name: string | null };
  likedByMe: boolean;
  likeCount: number;
  content: string;
  createdAt: Date;
};

const Feed = () => {
  const { data, isLoading } = api.post.getAllPosts.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (data?.length === 0) {
    return <div className="flex justify-center">No Posts yet.</div>;
  }
  return (
    <>
      <div className="flex flex-col">
        {data?.map((post) => {
          return <PostCard key={post.id} id={post.id} post={post} />;
        })}
      </div>
    </>
  );
};

export default Feed;

export const PostCard = ({ post }: { post: PostProps }) => {
  const toggleLike = api.post.toggleLike.useMutation({
    onSuccess: (data) => {
      console.log(data.addedLike);
    },
  });

  const handleToggleLike = () => {
    toggleLike.mutate({ id: post.id });
  };
  const DateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  });

  return (
    <div>
      <div className="flex border-b px-4 py-4" key={post.id}>
        <Link href={`/profiles/${post.user.id}`}>
          <ProfileImage
            width={50}
            height={50}
            src={post.user?.image || ""}
            className="gap-4"
          />
        </Link>
        <div className="flex=grow flex flex-col">
          <div className="flex">
            <Link
              href={`/profiles/${post.user?.id}`}
              className="px-3 font-bold"
            >
              {post.user?.name}
            </Link>
            <p className="text-gray-500">
              {DateFormatter.format(post.createdAt)}
            </p>
          </div>
          <p className="ml-3 flex">{post.content}</p>
          <HeartButton
            likeCount={post.likeCount}
            likedByMe={post.likedByMe}
            isLoading={toggleLike.isLoading}
            onClick={handleToggleLike}
            disabled={toggleLike.isLoading}
          />
        </div>
      </div>
    </div>
  );
};
