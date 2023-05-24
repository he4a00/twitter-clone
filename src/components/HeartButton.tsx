import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

type HeartButtonProps = {
  disabled: boolean;
  onClick: () => void;
  isLoading: boolean;
  liked: boolean;
  likeCount: number;
};

const HeartButton = ({
  disabled,
  onClick,
  isLoading,
  liked,
  likeCount,
}: HeartButtonProps) => {
  return (
    <button
      className="ml-3 flex p-2"
      disabled={isLoading || disabled}
      onClick={onClick}
    >
      <span>
        {liked ? (
          <div>
            <FavoriteIcon className="fill-red-500 " />
            <span className="text-red-500">Liked!</span>
          </div>
        ) : (
          <FavoriteBorderIcon className=" disabled:text-blue-500" />
        )}
      </span>

      <span className="ml-4">{likeCount}</span>
    </button>
  );
};

export default HeartButton;
