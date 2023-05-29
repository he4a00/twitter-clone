/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import Link from "next/link";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Image from "next/image";
import Button from "~/components/Button";
import { PostCard } from "~/components/Feed";
import { api } from "~/utils/api";
import Head from "next/head";
import Bio from "~/components/Bio";
import { useSession } from "next-auth/react";
import type {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { ssgHelper } from "~/server/api/ssgHelper";

interface UserRetweet {
  id: string;
  post: PostType;
  retweetedBy: string;
  userImage: string;
}

const ProfilePage: NextPage<
  InferGetServerSidePropsType<typeof getStaticProps>
> = ({ id }) => {
  const { data: sessionData } = useSession();
  const { data: bioData } = api.profile.getAllBio.useQuery();
  const { data: userPostsData } = api.profile.getUserPosts.useQuery({
    id: id.toString(),
  });

  const { data: userRetweets } = api.profile.getUserRetweets.useQuery({
    id: id.toString(),
  });

  console.log(userRetweets);

  const bioText = bioData?.find((bio) => bio.user.id === id)?.Text;

  return (
    <>
      <Head>
        <title>{userPostsData?.name}</title>
      </Head>
      <div>
        <header className="sticky top-0 border-b p-3">
          <div className="flex gap-8">
            <Link href="..">
              <KeyboardBackspaceIcon />
            </Link>
            <h1 className="font-bold">{userPostsData?.name}</h1>
          </div>
        </header>
        <div className="h-[200px] bg-slate-500"></div>
        <Image
          className="z-1 absolute top-[10rem] m-4 rounded-full"
          width={150}
          height={150}
          src={userPostsData?.image || ""}
          alt="profile image"
        />
        <div className="ml-1 mt-16 flex justify-between border-b p-5">
          <div>
            <h1 className="text-2xl font-bold">{userPostsData?.name}</h1>
            <div className="flex gap-3">
              {bioText || "No Bio."}
              <Bio />
            </div>
          </div>

          {!(id === sessionData?.user.id) && (
            <Button className="items-center" text={"Follow"} />
          )}
        </div>
        <div>
          <div className="flex flex-col">
            {userPostsData?.Post?.map((post) => {
              return (
                <>
                  <div className="flex items-center justify-between p-2">
                    <PostCard
                      key={post.id}
                      post={{
                        ...post,
                        id: post.id,
                        user: {
                          image: userPostsData.image || null,
                          id: post.id,
                          name: userPostsData?.name || null,
                        },
                      }}
                    />
                  </div>
                </>
              );
            })}

            {[userRetweets].map((retweetedPost, idx) => {
              if (retweetedPost) {
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2"
                  >
                    <PostCard
                      key={retweetedPost.post.id}
                      post={retweetedPost.post}
                      retweetedBy={retweetedPost.retweetedBy}
                      userImage={retweetedPost.userImage}
                    />
                  </div>
                );
              } else {
                return null; // or any fallback UI for null/undefined case
              }
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>
) {
  const id = context.params?.id;
  if (id == null) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const ssg = ssgHelper();
  await ssg.profile.getUserPosts.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}

export default ProfilePage;
