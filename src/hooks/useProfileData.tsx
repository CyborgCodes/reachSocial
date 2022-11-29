import { collection, doc, increment, writeBatch } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/AuthModalAtom";
import { Profile, ProfileSnippet, profileState } from "../../atoms/profileAtom";
import { auth, firestore } from "../../firebase/clientApp";

const useProfileData = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [profileStateValue, setProfileStateValue] =
    useRecoilState(profileState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFollowOrUnfollowProfile = (
    profileData: Profile,
    isFollowed: boolean
  ) => {
    //user validation check
    if (!user) {
      //open modal
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setLoading(true);
    if (isFollowed) {
      unfollowProfile(profileData.id);
      return;
    }
    followProfile(profileData);
  };

  const followProfile = async (profileData: Profile) => {
    //batch Writes from firebase
    try {
      //creating a new following snippet
      const batch = writeBatch(firestore);
      const newSnippet: ProfileSnippet = {
        profileId: profileData.id,
        photoURL: profileData.photoURL || "",
      };

      batch.set(
        doc(firestore, `users/${user?.uid}/profileSnippets`, profileData.id),
        newSnippet
      );

      //update the numberOfFollowers
      batch.update(doc(firestore, "users", profileData.id), {
        numberOfFollowers: increment(1),
      });

      await batch.commit();

      //update the recoil state profile.ProfileSnippet
      setProfileStateValue((prev) => ({
        ...prev,
        ProfileSnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log("followProfile error", error.message);
    }
    setLoading(false);
  };

  const unfollowProfile = async (profileId: string) => {
    //batch writes
    try {
      const batch = writeBatch(firestore);

      //deleting the following profile snippet from user
      batch.delete(
        doc(firestore, `users/${user?.uid}/profileSnippets`, profileId)
      );
      //updating the numberOfFollowers (-1)
      batch.update(doc(firestore, "users", profileId), {
        numberOfFollowers: increment(-1),
      });

      await batch.commit();

      setProfileStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.profileId !== profileId
        ),
      }));
    } catch (error: any) {
      console.log("Unfollow error", error.message);
      setError(error.message);
    }
    setLoading(false);
  };

  return {
    onFollowOrUnfollowProfile,
    loading,
    profileStateValue,
  };
};
export default useProfileData;
