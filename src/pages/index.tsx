import { type NextPage } from "next";
import Head from "next/head";
import CreatePost from "~/components/CreatePost";
import Feed from "~/components/Feed";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Social Media App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="sticky top-0 border-b p-3">
        <h1 className="font-bold">Home</h1>
      </header>
      <CreatePost />
      <Feed />
    </>
  );
};

export default Home;
