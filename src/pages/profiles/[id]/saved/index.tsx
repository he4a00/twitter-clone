import { useRouter } from "next/router";
import React from "react";

const SavedPosts = () => {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);

  return <div>SavedPosts</div>;
};

export default SavedPosts;
