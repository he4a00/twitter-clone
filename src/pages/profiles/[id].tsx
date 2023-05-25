import Link from "next/link";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import Image from "next/image";
import Button from "~/components/Button";
import { PostCard } from "~/components/Feed";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import Head from "next/head";

const ProfilePage = () => {
  const router = useRouter();
  const { id = "" } = router.query;

  const { data: userPostsData } = api.profile.getUserPosts.useQuery({
    id: id.toString(),
  });

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
            <h1 className="font-bold">
              {userPostsData?.name}
              {/* To Be changed with a dynamic name */}
            </h1>
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
          <h1 className="text-2xl font-bold">{userPostsData?.name}</h1>
          <Button text={"Follow"} />
        </div>
        <div>
          <div className="flex flex-col">
            {userPostsData?.Post?.map((post) => {
              return (
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
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
