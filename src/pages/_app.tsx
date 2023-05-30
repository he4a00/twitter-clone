import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import SideNav from "~/components/SideNav";
import { Toaster } from "react-hot-toast";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster position="bottom-center" />
      <div className="container mx-auto flex">
        <SideNav />
        <div className="align-start min-h-screen flex-grow border-x">
          <Component {...pageProps} />
        </div>
        {/* <RightNav /> */}
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
