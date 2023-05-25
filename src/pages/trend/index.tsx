/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PostCard } from "~/components/Feed";
import { api } from "~/utils/api";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Link from "next/link";
import Head from "next/head";

const TrendPage = () => {
  const { data: trendingPosts, isLoading } =
    api.post.getTrendingPosts.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (trendingPosts?.length === 0) {
    return <div className="flex justify-center">No Posts yet.</div>;
  }
  return (
    <>
      <Head>
        <title>Trending</title>
      </Head>
      <header className="sticky top-0 border-b p-3">
        <div className="flex gap-8">
          <Link href="..">
            <KeyboardBackspaceIcon />
          </Link>
          <h1 className="font-bold">Trendig Posts</h1>
        </div>
      </header>
      <div className="flex flex-col">
        {trendingPosts?.map((post) => {
          return <PostCard key={post.id} post={{ ...post, id: post.id }} />;
        })}
      </div>
    </>
  );
};

export default TrendPage;
