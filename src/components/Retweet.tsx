/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import React, { useEffect } from "react";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";
import toast, {
  type Renderable,
  type Toast,
  type ValueFunction,
} from "react-hot-toast";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";

type RetweetPostProps = {
  retweetCount: number;
  post: {
    id: string;
    user: { id: string; image: string | null; name: string | null };
    content: string;
    createdAt: Date;
    retweetedBy?: string | null;
    userImage?: string | null;
  };
  retweetedByMe: boolean;
  disabled: boolean;
  postId: string;
  setRetweetsCount: React.Dispatch<React.SetStateAction<number>>;
  setRetweeted: React.Dispatch<React.SetStateAction<boolean>>;
};

const Retweet = ({
  postId,
  setRetweetsCount,
  retweetCount,
  retweetedByMe,
  disabled,
  post,
  setRetweeted,
}: RetweetPostProps) => {
  const ctx = api.useContext();
  const { data: sessionData } = useSession();
  const { data: retweetsData } = api.post.getAllRetweets.useQuery();
  const retweetPost = api.post.retweetPost.useMutation({
    onSuccess: (data: {
      addedRetweet: boolean | ((prevState: boolean) => boolean);
    }) => {
      setRetweeted(data.addedRetweet);
      if (data.addedRetweet) {
        setRetweetsCount((prevRetweets) => prevRetweets + 1);
      }
      void ctx.post.getAllRetweets.invalidate();
    },
    onError: (error: {
      message: Renderable | ValueFunction<Renderable, Toast>;
    }) => {
      toast.error(error.message);
    },
  });

  const handleRetweet = (postId: string) => {
    retweetPost.mutate({ id: postId });
  };

  useEffect(() => {
    if (Array.isArray(retweetsData) && post.id && sessionData?.user?.id) {
      const postRetweetsCount = retweetsData.filter(
        (retweet) => retweet.post?.id === post.id
      ).length;
      setRetweetsCount(postRetweetsCount);

      const userRetweetedPost = retweetsData.some(
        (retweet) =>
          retweet.post?.id === post.id &&
          retweet.post.user?.id === sessionData?.user?.id
      );
      setRetweeted(userRetweetedPost);
    }
  }, [
    post.id,
    retweetsData,
    sessionData?.user?.id,
    setRetweeted,
    setRetweetsCount,
  ]);

  return (
    <>
      <button
        disabled={disabled}
        className="ml-3 flex p-2"
        onClick={() => handleRetweet(postId)}
      >
        <span>
          {retweetedByMe ? (
            <SwapCallsIcon className="fill-blue-500" />
          ) : (
            <SwapCallsIcon />
          )}
        </span>
        <span className="ml-4">{retweetCount}</span>
      </button>
    </>
  );
};

export default Retweet;
