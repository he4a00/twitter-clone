import { useSession } from "next-auth/react";
import ProfileImage from "./ProfileImage";
import Button from "./Button";
import { useState } from "react";
import type { FormEvent } from "react";
import { api } from "~/utils/api";

const CreatePost = () => {
  const { data: session } = useSession();
  const [postContent, setPostContent] = useState("");

  const ctx = api.useContext();
  const { mutate, isLoading } = api.post.createPost.useMutation({
    onSuccess: () => {
      setPostContent("");
      void ctx.post.getAllPosts.invalidate();
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutate({ content: postContent });
  };
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className=" flex flex-grow flex-col gap-2 border-b px-3 py-4"
      >
        {session ? (
          <>
            <div className="flex gap-4">
              <ProfileImage
                width={50}
                height={50}
                src={session?.user.image || ""}
              />
              <textarea
                className=" flex-grow resize-none outline-none"
                placeholder="What's happening"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
            </div>
            <Button
              className="self-end"
              disabled={postContent.length === 0 || isLoading}
              text={"Post"}
            />{" "}
          </>
        ) : (
          ""
        )}
      </form>
    </>
  );
};

export default CreatePost;
