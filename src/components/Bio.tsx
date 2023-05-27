/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from "react";
import { api } from "~/utils/api";
import type { FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Bio = () => {
  const [bioContent, setBioContent] = useState("");
  const { data: session } = useSession();
  const ctx = api.useContext();
  const createBio = api.profile.AddBio.useMutation({
    onSuccess: () => {
      void ctx.profile.getAllBio.invalidate();
      setBioContent("");
    },
  });
  const { data: bioData } = api.profile.getAllBio.useQuery();

  const handleCreateBio = (e: FormEvent) => {
    e.preventDefault();
    createBio.mutate({ text: bioContent });
  };
  const router = useRouter();
  const { id = "" } = router.query;

  const userHasBio = bioData?.some((bio) => bio.user.id === id);

  return (
    <>
      {session?.user.id === id && !userHasBio && (
        <form onSubmit={handleCreateBio}>
          <input
            placeholder="Add Bio"
            value={bioContent}
            onChange={(e) => setBioContent(e.target.value)}
          />
          <button type="submit">Add Bio</button>
        </form>
      )}
    </>
  );
};

export default Bio;
