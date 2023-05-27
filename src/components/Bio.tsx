/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useState } from "react";
import { api } from "~/utils/api";
import type { FormEvent } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import EditIcon from "@mui/icons-material/Edit";
import { Button, TextField } from "@mui/material";

const Bio = () => {
  const [bioContent, setBioContent] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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
        <form className="flex" onSubmit={handleCreateBio}>
          {isOpen ? (
            <div>
              <TextField
                className="flex p-3 outline-none"
                placeholder="Add Bio"
                value={bioContent}
                onChange={(e) => setBioContent(e.target.value)}
              />
              <Button
                variant="contained"
                disabled={bioContent.length === 0}
                type="submit"
                className="ml-4 text-red-500"
              >
                Add Bio
              </Button>
              <Button
                variant="contained"
                onClick={() => setIsOpen(false)}
                className="ml-6 text-red-500 hover:bg-none"
                type="submit"
              >
                Close
              </Button>
            </div>
          ) : (
            <button onClick={() => setIsOpen(true)}>
              <EditIcon />
            </button>
          )}
        </form>
      )}
    </>
  );
};

export default Bio;
