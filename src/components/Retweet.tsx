import React from "react";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";

type RetweetPostProps = {
  onClick: () => void;
  retweetCount: number;
  retweetedByMe: boolean;
};

const Retweet = ({
  onClick,
  retweetCount,
  retweetedByMe,
}: RetweetPostProps) => {
  return (
    <>
      <button className="ml-3 flex p-2" onClick={onClick}>
        <span>
          {retweetedByMe ? (
            <div>
              <SwapCallsIcon className="fill-red-500 " />
              <span className="text-red-500">Shared!</span>
            </div>
          ) : (
            <SwapCallsIcon className=" disabled:text-blue-500" />
          )}
        </span>
        <span className="ml-4">{retweetCount}</span>
      </button>
    </>
  );
};

export default Retweet;
