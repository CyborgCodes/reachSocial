import { doc, getDoc } from "firebase/firestore";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import safeJsonStringify from "safe-json-stringify";
import { Post } from "../../../atoms/postsAtom";
import { Profile, profileState } from "../../../atoms/profileAtom";
import NotFound from "../../../components/Community/NotFound";
import PageContent from "../../../components/Layout/PageContent";
import MyPostsLikes from "../../../components/UserProfile/MyPostsLikes";
import ProfileHeader from "../../../components/UserProfile/ProfileHeader";
import UserProfileItem from "../../../components/UserProfile/UserProfileItem";
import { auth, firestore } from "../../../firebase/clientApp";

type profileProps = {
  post: Post;
  profileData: Profile;
  loading?: boolean;
};

const profile: React.FC<profileProps> = ({ post, profileData, loading }) => {
  console.log("here is the data", profileData);
  const setProfileStateValue = useSetRecoilState(profileState);

  if (!profileData) {
    return <NotFound />;
  }

  useEffect(() => {
    setProfileStateValue((prev) => ({
      ...prev,
      currentProfile: profileData,
    }));
  }, [profileData]);

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

export default profile;
