import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import TagIcon from "@mui/icons-material/Tag";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";

const SideNav = () => {
  const { data: session } = useSession();
  return (
    <nav className=" sticky top-0 m-0 p-3 md:mr-10 md:p-10 ">
      <ul className="flex flex-col gap-4 py-2">
        <li className="rounded-full p-3 transition-all duration-300 hover:bg-slate-200">
          <Link href="/">
            <span className="flex items-center gap-4">
              <HomeIcon />
              <span className="hidden md:inline">Home</span>
            </span>
          </Link>
        </li>

        <li className="rounded-full p-3 transition-all duration-300 hover:bg-slate-200">
          <Link href="/trend">
            <span className="flex items-center gap-4">
              <TagIcon />
              <span className="hidden md:inline">Trending</span>
            </span>
          </Link>
        </li>
        <li className="rounded-full p-3 transition-all duration-300 hover:bg-slate-200">
          <Link href="/retweet">
            <span className="flex items-center gap-4">
              <SwapCallsIcon />
              <span className="hidden md:inline">Retweets</span>
            </span>
          </Link>
        </li>
        {session?.user ? (
          <li className="rounded-full p-3 transition-all duration-300 hover:bg-slate-200">
            <Link href={`/profiles/${session?.user.id}`}>
              <span className="flex items-center gap-4">
                <AccountCircleIcon />
                <span className="hidden md:inline">Profile</span>
              </span>
            </Link>
          </li>
        ) : (
          ""
        )}
        <li className="rounded-full p-3 transition-all duration-300 hover:bg-slate-200">
          {session?.user ? (
            <button
              onClick={() => void signOut()}
              className="flex items-center gap-4"
            >
              <LogoutIcon />
              <span className="hidden md:inline">Logout</span>
            </button>
          ) : (
            <button
              onClick={() => void signIn("google")}
              className="flex items-center gap-4"
            >
              <LoginIcon />
              <span className="hidden md:inline">Login</span>
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
