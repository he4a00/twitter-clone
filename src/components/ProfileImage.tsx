import Image from "next/image";
import React from "react";

type ImageProps = {
  src: string;
  className?: string;
  width: number;
  height: number;
};

const ProfileImage = ({ src, className = "", width, height }: ImageProps) => {
  return (
    <Image
      width={width}
      height={height}
      src={src}
      className={`rounded-full ${className}`}
      alt="Profile Image"
    />
  );
};

export default ProfileImage;
