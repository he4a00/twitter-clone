import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

type HeartButtonProps = {
  disabled: boolean;
  onClick: () => void;
  isLoading: boolean;
  liked: boolean;
};

const HeartButton = ({
  disabled,
  onClick,
  isLoading,
  liked,
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
            <FavoriteIcon className="fill-red-500" />
            <span className="text-red-500">Liked!</span>
          </div>
        ) : (
          <FavoriteBorderIcon />
        )}
      </span>

      <span className="ml-4">0</span>
    </button>
  );
};

export default HeartButton;
