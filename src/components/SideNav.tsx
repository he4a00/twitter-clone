import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import LoginIcon from "@mui/icons-material/Login";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

const SideNav = () => {
  const { data: session } = useSession();
  return (
    <nav className=" sticky top-0 m-0 mr-10 p-4 ">
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
            <span></span>
          </li>
        )}
        <li>
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
