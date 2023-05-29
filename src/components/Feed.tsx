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
import Retweet from "./Retweet";
import toast from "react-hot-toast";

const Feed = () => {
  const { data: allPosts, isLoading } = api.post.getAllPosts.useQuery();
  const { data: retweetsData } = api.post.getAllRetweets.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (allPosts?.length === 0) {
    return <div className="flex justify-center">No Posts yet.</div>;
  }
  return (
    <>
      <div className="flex flex-col">
        {allPosts?.map((post) => {
          return (
            <PostCard
              key={post.id}
              post={{ ...post, id: post.id }}
              retweetedBy={""}
            />
          );
        })}
        {retweetsData?.map((retweet, idx) => {
          return (
            <PostCard
              key={idx}
              post={retweet.post}
              retweetedBy={retweet.retweetedBy}
              userImage={retweet.userImage}
            />
          );
        })}
      </div>
    </>
  );
};

export default Feed;

type PostProps = {
  id: string;
  user: { id: string; image: string | null; name: string | null };
  content: string;
  createdAt: Date;
  retweetedBy?: string | null;
  userImage?: string | null;
};

export const PostCard = ({
  post,
  retweetedBy,
  userImage,
}: {
  post: PostProps;
  retweetedBy?: string | null;
  userImage?: string | null;
}) => {
  const [liked, setLiked] = useState(false);
  const [retweeted, setRetweeted] = useState(false);
  const [likes, setLikes] = useState(0);
  const [retweetsCount, setRewtweetsCount] = useState(0);
  const { data: postLikes } = api.post.getLikes.useQuery();

  const { data: retweetsData, isLoading: retweetLoading } =
    api.post.getAllRetweets.useQuery();

  const { data: sessionData } = useSession();
  const ctx = api.useContext();

  const deletePost = api.profile.deleteUserPost.useMutation({
    onSuccess: () => {
      void ctx.post.getAllPosts.invalidate();
      void ctx.post.getAllRetweets.invalidate();
    },
  });

  const handleDelete = () => {
    try {
      deletePost.mutate({ postId: post.id });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
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

  // likes useEffect
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

  // retweets useEffect

  useEffect(() => {
    if (Array.isArray(retweetsData) && post.id && sessionData?.user?.id) {
      const postRetweetsCount = retweetsData.filter(
        (retweet) => retweet.post?.id === post.id
      ).length;
      setRewtweetsCount(postRetweetsCount);

      const userRetweetedPost = retweetsData.some(
        (retweet) =>
          retweet.post?.id === post.id &&
          retweet.post.user.id === sessionData?.user?.id
      );
      setRetweeted(userRetweetedPost);
    }
  }, [post.id, retweetsData, sessionData?.user?.id]);

  const handleToggleLike = () => {
    toggleLike.mutate({ id: post.id });
  };
  const DateFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  // retweet logic

  const retweetPost = api.post.retweetPost.useMutation({
    onSuccess: (data) => {
      setRetweeted(data.addedRetweet);
      if (data.addedRetweet) {
        setRewtweetsCount((prevRetweets) => prevRetweets + 1);
      }
      void ctx.post.getAllRetweets.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleRetweet = () => {
    retweetPost.mutate({ id: post.id });
  };

  return (
    <div>
      {retweetedBy ? (
        <div className="flex items-center gap-4  p-2">
          <ProfileImage
            width={30}
            height={30}
            src={userImage || ""}
            className="gap-4"
          />
          <h1 className="text-sm">
            <span className="font-bold">{retweetedBy}</span> Retweeted{" "}
            <span className="font-bold">{post.user.name}</span> Post
          </h1>
        </div>
      ) : null}
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
          <div className="px-3 underline"></div>
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

            <Retweet
              onClick={handleRetweet}
              retweetCount={retweetsCount}
              retweetedByMe={retweeted}
              disabled={retweetLoading || !sessionData}
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
