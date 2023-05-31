import React, { useEffect } from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

type HeartButtonProps = {
  disabled: boolean;
  post: {
    id: string;
    user: { id: string; image: string | null; name: string | null };
    content: string;
    createdAt: Date;
    retweetedBy?: string | null;
    userImage?: string | null;
  };
  liked: boolean;
  postId: string;
  likeCount: number;
  setLikes: React.Dispatch<React.SetStateAction<number>>;
  setLiked: React.Dispatch<React.SetStateAction<boolean>>;
};

const HeartButton = ({
  disabled,
  liked,
  likeCount,
  setLikes,
  setLiked,
  postId,
  post,
}: HeartButtonProps) => {
  const { data: postLikes } = api.post.getLikes.useQuery();
  const { data: sessionData } = useSession();
  const ctx = api.useContext();
  const toggleLike = api.post.toggleLike.useMutation({
    onSuccess: (data: {
      addedLike: boolean | ((prevState: boolean) => boolean);
    }) => {
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
  }, [
    postLikes?.length,
    postLikes,
    sessionData?.user?.id,
    setLikes,
    setLiked,
    post.id,
  ]);

  const handleToggleLike = (postId: string) => {
    toggleLike.mutate({ id: postId });
  };
  return (
    <button
      className="ml-3 flex p-2"
      disabled={toggleLike.isLoading || disabled}
      onClick={() => handleToggleLike(postId)}
    >
      <span>
        {liked ? (
          <div>
            <FavoriteIcon className="fill-red-500 " />
            <span className="text-red-500">Liked!</span>
          </div>
        ) : (
          <FavoriteBorderIcon className=" disabled:text-blue-500" />
        )}
      </span>

      <span className="ml-4">{likeCount}</span>
    </button>
  );
};

export default HeartButton;
