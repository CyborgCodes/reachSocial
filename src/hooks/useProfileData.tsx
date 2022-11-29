import { collection, doc, writeBatch } from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/AuthModalAtom";
import { Followers, Profile, profileState } from "../../atoms/profileAtom";
import { auth, firestore } from "../../firebase/clientApp";

const useProfileData = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [profileStateValue, setProfileStateValue] =
    useRecoilState(profileState);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFollow = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    profile: Profile,
    follow: number,
    profileId: string
  ) => {
    event.stopPropagation();
    //check for a user => if not, open auth modal
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    try {
      const { numberOfFollowers } = profile;
      const existingFollow = profileStateValue.followers.find(
        (follow) => follow.profileId === profileId
      );
      const batch = writeBatch(firestore);
      const updatedProfile = { ...profile };
      const updatedProfiles = [...profileStateValue.profile];
      let updatedProfileFollows = [...profileStateValue.followers];
      let followChange = follow;

      //new follower
      if (!existingFollow) {
        //create a new following document
        const followingRef = doc(
          collection(firestore, "users", `${user?.uid}/following`)
        );
        const newFollow: Followers = {
          id: followingRef.id,
          profileId,
          followersValue: follow,
        };

        batch.set(followingRef, newFollow);
        updatedProfile.numberOfFollowers = numberOfFollowers + follow;
        updatedProfileFollows = [...updatedProfileFollows, newFollow];
      }
      //Existing follow
      else {
        const followingRef = doc(
          firestore,
          "users",
          `${user?.uid}/following/${existingFollow.id}`
        );
        //Removing a follow
        if (existingFollow.followersValue === follow) {
          updatedProfile.numberOfFollowers = numberOfFollowers - follow;
          updatedProfileFollows = updatedProfileFollows.filter(
            (follow) => follow.id !== existingFollow.id
          );
          batch.delete(followingRef);
          followChange *= -1;
        } else {
          updatedProfile.numberOfFollowers = numberOfFollowers + 2 * follow;

          const followIdx = profileStateValue.followers.findIndex(
            (follow) => follow.id === existingFollow.id
          );
          updatedProfileFollows[followIdx] = {
            ...existingFollow,
            followersValue: follow,
          };
          batch.update(followingRef, {
            followersValue: follow,
          });
        }
      }
      //update state with updated value
      const profileIdx = profileStateValue.profile.findIndex(
        (item) => item.id === profile.id
      );
      updatedProfiles[profileIdx] = updatedProfile;
      setProfileStateValue((prev) => ({
        ...prev,
        profile: updatedProfiles,
        followers: updatedProfileFollows,
      }));
      //update the profile doc
      const profileRef = doc(firestore, "users", user.uid!);
      batch.update(profileRef, {
        numberOfFollowers: numberOfFollowers + followChange,
      });

      await batch.commit();
    } catch (error) {
      console.log("onFollow error", error);
    }
  };

  return {};
};
export default useProfileData;
