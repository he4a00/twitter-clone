import type { ButtonHTMLAttributes } from "react";
import React from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string;
  gray?: boolean;
  small?: boolean;
  disabled?: boolean;
  text: string;
};

const Button = ({
  className = "",
  gray,
  small,
  disabled,
  text,
}: ButtonProps) => {
  const sizeClasses = small ? "px-2 py-1 " : "px-4 py-2 font-bold";
  const colorClasses = gray
    ? "bg-gray-400 hover:bg-gray-300 focus:visible:bg-gray-300"
    : "bg-blue-500 hover:bg-blue-400 focus:visible:bg-blue-400";
  return (
    <button
      disabled={disabled}
      className={`flex rounded-full text-white transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-blue-300 ${colorClasses} ${sizeClasses} ${className}`}
    >
      {text}
    </button>
  );
};

export default Button;
