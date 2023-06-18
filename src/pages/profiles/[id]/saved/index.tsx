/* eslint-disable @typescript-eslint/no-floating-promises */
import Head from "next/head";
import React from "react";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PostCard } from "~/components/Feed";

const SavedPosts = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: savedPosts } = api.post.getSavedPosts.useQuery({
    id: id ? id?.toString() : "",
  });

  console.log(savedPosts);

  const { data: sessionData } = useSession();

  if (sessionData?.user.id !== id) {
    router.push("/");
  }

  return (
    <div>
      <Head>
        <title>Saved Posts</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="sticky top-0 border-b p-3">
        <h1 className="font-bold">Saved Posts</h1>
      </header>

      <PostCard
        key={savedPosts?.post.id}
        post={{
          ...savedPosts?.post,
          id: savedPosts?.post.id || "",
          user: {
            image: savedPosts?.post.user.image || null,
            id: savedPosts?.post.id || "",
            name: savedPosts?.post.user.name || null,
          },
          content: savedPosts?.post.content || "",
          createdAt: savedPosts?.post.createdAt || new Date(),
          userImage: savedPosts?.post.user.image || null,
        }}
      />
    </div>
  );
};

export default SavedPosts;
