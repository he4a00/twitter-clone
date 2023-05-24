import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

type HeartButtonProps = {
  likeCount: number;
  likedByMe: boolean;
  disabled: boolean;
  onClick: () => void;
  isLoading: boolean;
};

const HeartButton = ({
  likeCount,
  likedByMe,
  disabled,
  onClick,
  isLoading,
}: HeartButtonProps) => {
  const isLiked = likedByMe || false;
  return (
    <button
      className="flex gap-2 p-3"
      disabled={isLoading || disabled}
      onClick={onClick}
    >
      {isLiked && <span className="text-red-500">Liked!</span>}
      <span>
        {isLiked ? (
          <FavoriteIcon className="fill-red-500" />
        ) : (
          <FavoriteBorderIcon />
        )}
      </span>
      <span>{likeCount}</span>
    </button>
  );
};

export default HeartButton;
