import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const SideNav = () => {
  const { data: session } = useSession();
  return (
    <nav className=" sticky top-0 mr-10 hidden p-4 md:inline ">
      <ul className="flex flex-col gap-4 py-2">
        <li>
          <Link href="/">
            <span className="flex items-center gap-4">
              <HomeIcon />
              <span className="hidden md:inline">Home</span>
            </span>
          </Link>
        </li>
        {session?.user ? (
          <li>
            <Link href={`/profiles/${session?.user.id}`}>
              <span className="flex items-center gap-4">
                <AccountCircleIcon />
                <span className="hidden md:inline">Profile</span>
              </span>
            </Link>
          </li>
        ) : (
          <li>
            <span>Profile</span>
          </li>
        )}
        <li>
          {session?.user ? (
            <button
              onClick={() => void signOut()}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => void signIn("google")}
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              <span>
                <LoginIcon />
              </span>
              Sign In
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
