import React from "react";
import { useRecoilState } from "recoil";
import { postState } from "../../atoms/postsAtom";

const usePosts = () => {
  const [postStateValue, setPostStateValue] = useRecoilState(postState);

  const onLike = async () => {};

  const onSelectPost = () => {};

  const onDeletePost = async () => {};

  return {
    postStateValue,
    setPostStateValue,
    onLike,
    onSelectPost,
    onDeletePost,
  };
};
export default usePosts;
