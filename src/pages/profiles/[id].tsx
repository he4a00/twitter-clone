/* eslint-disable @typescript-eslint/no-unsafe-call */
import Link from "next/link";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Image from "next/image";
import Button from "~/components/Button";
import { PostCard } from "~/components/Feed";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Head from "next/head";
import Bio from "~/components/Bio";

const ProfilePage = () => {
  const router = useRouter();
  const { id = "" } = router.query;
  const { data: bioData } = api.profile.getAllBio.useQuery();

  const { data: userPostsData } = api.profile.getUserPosts.useQuery({
    id: id.toString(),
  });

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
            <Bio />
            {bioText || "No Bio."}
          </div>
          <Button className="items-center" text={"Follow"} />
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
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
