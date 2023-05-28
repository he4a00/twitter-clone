/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Head from "next/head";
import Link from "next/link";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { api } from "~/utils/api";
import { PostCard } from "~/components/Feed";

const RetweetPage = () => {
  const { data: retweetsData } = api.post.getAllRetweets.useQuery();

  return (
    <>
      <Head>
        <title>Retweets</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="sticky top-0 border-b p-3">
        <div className="flex gap-8">
          <Link href="..">
            <KeyboardBackspaceIcon />
          </Link>
          <h1 className="font-bold">Retweets</h1>
        </div>
      </header>
      {retweetsData?.map((retweet) => {
        return (
          <PostCard
            key={retweet.post.id}
            post={retweet.post}
            retweetedBy={retweet.retweetedBy}
          />
        );
      })}
    </>
  );
};

export default RetweetPage;
