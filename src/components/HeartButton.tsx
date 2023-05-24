import React from "react";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

type HeartButtonProps = {
  disabled: boolean;
  onClick: () => void;
  isLoading: boolean;
};

const HeartButton = ({ disabled, onClick, isLoading }: HeartButtonProps) => {
  return (
    <button
      className="ml-3 flex p-2"
      disabled={isLoading || disabled}
      onClick={onClick}
    >
      <span>
        <FavoriteBorderIcon />
      </span>
      <span className="ml-4">0</span>
    </button>
  );
};

export default HeartButton;
