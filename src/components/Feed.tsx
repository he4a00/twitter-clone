/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { api } from "~/utils/api";
import ProfileImage from "./ProfileImage";
import Link from "next/link";

const Feed = () => {
  const { data, isLoading } = api.post.getAllPosts.useQuery();

  if (isLoading) return <div>Loading...</div>;
  const DateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  });

  if (data?.length === 0) {
    return <div className="flex justify-center">No Posts yet.</div>;
  }
  return (
    <>
      <div className="flex flex-col">
        {data?.map((post) => {
          return (
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
                    href={`/profiles/${post.user.id}`}
                    className="px-3 font-bold"
                  >
                    {post.user.name}
                  </Link>
                  <p className="text-gray-500">
                    {DateFormatter.format(post.createdAt)}
                  </p>
                </div>
                <p className="ml-3 flex">{post.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Feed;
