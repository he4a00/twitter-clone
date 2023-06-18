/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { api } from "~/utils/api";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import type { PostLike } from "@prisma/client";

type SavedPost = {
  id: string;

  post?: {
    id: string;
    user: { id: string; image: string | null; name: string | null };
    content: string;
    createdAt: Date;
    likes: PostLike[];
  };
};

type SaveButtonProps = {
  saved: boolean | undefined;
  post: {
    id: string;
    user: { id: string; image: string | null; name: string | null };
    content: string;
    createdAt: Date;
    retweetedBy?: string | null;
    userImage?: string | null;
  };
  postId: string;
  setSaved: React.Dispatch<React.SetStateAction<boolean>>;
};

const SaveButton = ({ saved, post, postId, setSaved }: SaveButtonProps) => {
  const router = useRouter();
  const { id } = router.query;
  const { data: savedPostsData } = api.post.getSavedPosts.useQuery({
    id: id ? id?.toString() : "",
  });
  const { data: sessionData } = useSession();
  const ctx = api.useContext();
  const addToSavedPosts = api.post.addtoSavedPosts.useMutation({
    onSuccess: (data: {
      addedSaved: boolean | ((prevState: boolean) => boolean);
    }) => {
      setSaved(data.addedSaved);
      void ctx.post.getSavedPosts.invalidate();
      toast.success(
        data.addedSaved
          ? `This post has been saved successfully`
          : `This post has been removed frm your saved posts`
      );
    },
  });
  useEffect(() => {
    const userSavedPost: SavedPost | undefined = savedPostsData?.post;

    const userHasSavedPost = Boolean(
      userSavedPost &&
        userSavedPost.id === post.id &&
        userSavedPost.post?.user.id === sessionData?.user?.id
    );
    setSaved(userHasSavedPost);
  }, [post.id, saved, savedPostsData, sessionData?.user?.id, setSaved]);

  const handleSavePost = (postId: string) => {
    addToSavedPosts.mutate({ id: postId });
  };

  return (
    <button className="ml-3 flex p-2" onClick={() => handleSavePost(postId)}>
      <span>
        {saved ? (
          <BookmarkAddedIcon className="fill-blue-500" />
        ) : (
          <BookmarkAddIcon />
        )}
      </span>
    </button>
  );
};

export default SaveButton;
