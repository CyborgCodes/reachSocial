import { doc, getDoc } from "firebase/firestore";
import { GetServerSidePropsContext } from "next";
import React, { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import safeJsonStringify from "safe-json-stringify";
import { Post } from "../../../atoms/postsAtom";
import { Profile, profileState } from "../../../atoms/profileAtom";
import PageContent from "../../../components/Layout/PageContent";
import MyPostsLikes from "../../../components/UserProfile/MyPosts";
import NotFoundProfile from "../../../components/UserProfile/NotFoundProfile";
import ProfileHeader from "../../../components/UserProfile/ProfileHeader";
import UserProfileItem from "../../../components/UserProfile/UserProfileItem";
import { firestore } from "../../../firebase/clientApp";

type ProfileProps = {
  post: Post;
  profileData: Profile;
  loading?: boolean;
};

const Profile: React.FC<ProfileProps> = ({ post, profileData, loading }) => {
  console.log("here is the data", profileData);
  const setProfileStateValue = useSetRecoilState(profileState);
  const TITLE = "Reach Social Media";

  useEffect(() => {
    setProfileStateValue((prev) => ({
      ...prev,
      currentProfile: profileData,
    }));
  }, [profileData]);

  if (!profileData) {
    return <NotFoundProfile />;
  }

  return (
    <>
      <title>{TITLE}</title>
      <ProfileHeader profileData={profileData} />
      <PageContent>
        <>
          <MyPostsLikes post={post} profileData={profileData} />
        </>
        <>
          <UserProfileItem profileData={profileData} />
        </>
      </PageContent>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  try {
    const profileDocRef = doc(firestore, "users", context.query.id as string);
    const profileDoc = await getDoc(profileDocRef);
    return {
      props: {
        profileData: profileDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: profileDoc.id, ...profileDoc.data() })
            )
          : "",
      },
    };
  } catch (error) {
    console.log("getServerSideProps error", error);
  }
}

export default Profile;
