import { User } from "firebase/auth";
import React from "react";
import PageContent from "../../../components/Layout/PageContent";
import UserProfileItem from "../../../components/UserProfile/UserProfileItem";
import { getAuth } from "firebase/auth";
import MyPostsLikes from "../../../components/UserProfile/MyPostsLikes";
import { Post } from "../../../atoms/postsAtom";

type profileProps = {
  post: Post;
};

const profile: React.FC<profileProps> = ({ post }) => {
  return (
    <PageContent>
      <>
        <MyPostsLikes post={post} />
      </>
      <>
        <UserProfileItem />
      </>
    </PageContent>
  );
};
export default profile;
