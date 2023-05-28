import React from "react";
import SwapCallsIcon from "@mui/icons-material/SwapCalls";

type RetweetPostProps = {
  onClick: () => void;
  retweetCount: number;
  retweetedByMe: boolean;
  disabled: boolean;
};

const Retweet = ({
  onClick,
  retweetCount,
  retweetedByMe,
  disabled,
}: RetweetPostProps) => {
  return (
    <>
      <button disabled={disabled} className="ml-3 flex p-2" onClick={onClick}>
        <span>
          {retweetedByMe ? (
            <SwapCallsIcon className="fill-blue-500" />
          ) : (
            <SwapCallsIcon />
          )}
        </span>
        <span className="ml-4">{retweetCount}</span>
      </button>
    </>
  );
};

export default Retweet;
