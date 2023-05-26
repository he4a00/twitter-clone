/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { api } from "~/utils/api";
import ProfileImage from "./ProfileImage";
import { useEffect, useState } from "react";
import Link from "next/link";
import HeartButton from "./HeartButton";
import { useSession } from "next-auth/react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

type PostProps = {
  id: string;
  user: { id: string; image: string | null; name: string | null };
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
          return <PostCard key={post.id} post={{ ...post, id: post.id }} />;
        })}
      </div>
    </>
  );
};

export default Feed;

export const PostCard = ({ post }: { post: PostProps }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const { data: postLikes } = api.post.getLikes.useQuery();
  const { data: sessionData } = useSession();
  const ctx = api.useContext();

  const deletePost = api.profile.deleteUserPost.useMutation({
    onSuccess: () => {
      void ctx.post.getAllPosts.invalidate();
    },
  });

  const handleDelete = () => {
    try {
      deletePost.mutate({ postId: post.id });
      // Perform any necessary actions after successful deletion
    } catch (error) {
      console.error("Error deleting post:", error);
      // Handle the error, e.g., show an error message to the user
    }
    console.log("Fsfs");
  };

  const toggleLike = api.post.toggleLike.useMutation({
    onSuccess: (data) => {
      setLiked(data.addedLike);
      if (data.addedLike) {
        setLikes((prevLikes) => prevLikes + 1);
      } else {
        setLikes((prevLikes) => prevLikes - 1);
      }
      void ctx.post.getTrendingPosts.invalidate();
    },
  });
  useEffect(() => {
    const postLikesCount =
      postLikes?.filter((like) => like.postId === post.id).length ?? 0;
    setLikes(postLikesCount);
    if (postLikes) {
      const userLikedPost = postLikes.some(
        (like) =>
          like.postId === post.id && like.userId === sessionData?.user?.id
      );
      setLiked(userLikedPost);
    }
  }, [post.id, postLikes?.length, postLikes, sessionData?.user?.id]);

  const handleToggleLike = () => {
    toggleLike.mutate({ id: post.id });
  };
  const DateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
  });

  return (
    <div>
      <div className="flex border-b px-4 py-4">
        <Link href={`/profiles/${post.user?.id}`}>
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
              className="px-3 font-bold hover:underline"
            >
              {post.user?.name}
            </Link>
            <p className="text-gray-500">
              {DateFormatter.format(post.createdAt)}
            </p>
          </div>
          <p className="ml-3 flex">{post.content}</p>

          <div className="flex">
            <HeartButton
              isLoading={toggleLike.isLoading}
              onClick={handleToggleLike}
              disabled={toggleLike.isLoading || !sessionData}
              liked={liked}
              likeCount={likes}
            />

            {sessionData?.user?.id === post.user.id && (
              <button
                className="focus:visible:bg-blue-400 fo  flex px-4 py-2 transition-colors duration-200 hover:text-red-500 disabled:cursor-not-allowed disabled:text-gray-300"
                onClick={handleDelete}
                disabled={deletePost.isLoading}
              >
                <DeleteOutlineIcon />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
