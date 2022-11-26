import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Post } from "../../../atoms/postsAtom";
import { Profile } from "../../../atoms/profileAtom";
import PageContent from "../../../components/Layout/PageContent";
import MyPostsLikes from "../../../components/UserProfile/MyPostsLikes";
import ProfileHeader from "../../../components/UserProfile/ProfileHeader";
import UserProfileItem from "../../../components/UserProfile/UserProfileItem";
import { auth } from "../../../firebase/clientApp";

type profileProps = {
  post: Post;
  profileData: Profile;
  loading?: boolean;
};

const profile: React.FC<profileProps> = ({ post, profileData, loading }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  return (
    <>
      <ProfileHeader profileData={profileData} />
      <PageContent>
        <>
          <MyPostsLikes post={post} profileData={profileData} />
        </>
        <>
          <UserProfileItem loading={loading} profileData={profileData} />
        </>
      </PageContent>
    </>
  );
};

export default profile;
