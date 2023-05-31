import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { api } from "~/utils/api";

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
  const { data: savedPostsData } = api.post.getSavedPosts.useQuery();

  const { data: sessionData } = useSession();
  const ctx = api.useContext();
  const addToSavedPosts = api.post.addtoSavedPosts.useMutation({
    onSuccess: (data: {
      addedSaved: boolean | ((prevState: boolean) => boolean);
    }) => {
      console.log(data);
      setSaved(data.addedSaved);
      void ctx.post.getSavedPosts.invalidate();
    },
  });
  useEffect(() => {
    const userSavedPost = savedPostsData?.find(
      (saved) =>
        saved.post?.id === post.id && saved.user.id === sessionData?.user?.id
    );

    const userHasSavedPost = Boolean(userSavedPost);
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
