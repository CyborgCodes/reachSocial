import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
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

  const getMySnippets = async () => {
    setLoading(true);
    try {
      //get user snippets
      const snippetDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/profileSnippets`)
      );
      const snippets = snippetDocs.docs.map((doc) => ({ ...doc.data() }));
      setProfileStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as ProfileSnippet[],
      }));
      console.log("here are my profile snippets", snippets);
    } catch (error: any) {
      console.log("getMySnippets error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const followProfile = async (profileData: Profile) => {
    //batch Writes from firebase
    try {
      //creating a new following snippet
      const batch = writeBatch(firestore);
      const newSnippet: ProfileSnippet = {
        profileId: profileData.id,
        photoURL: profileData.photoURL || "",
        displayName: profileData.displayName,
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
      console.log("followProfile error", error);
      setError(error.message);
    }
    window.location.reload();
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
      //update recoil state - profile.mySnippets
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
    window.location.reload();
    setLoading(false);
  };

  const getProfileData = async (profileId: string) => {
    try {
      const profileDocRef = doc(firestore, "users", profileId);
      const profileDoc = await getDoc(profileDocRef);

      setProfileStateValue((prev) => ({
        ...prev,
        currentProfile: {
          id: profileDoc.id,
          ...profileDoc.data(),
        } as Profile,
      }));
    } catch (error) {
      console.log("getProfileData error", error);
    }
  };

  useEffect(() => {
    if (!user) {
      setProfileStateValue((prev) => ({
        ...prev,
        mySnippets: [],
      }));
      return;
    }
    getMySnippets();
  }, [user]);

  useEffect(() => {
    const { profileId } = router.query;

    if (profileId && !profileStateValue.currentProfile) {
      getProfileData(profileId as string);
    }
  }, [router.query, profileStateValue.currentProfile]);

  return {
    onFollowOrUnfollowProfile,
    loading,
    profileStateValue,
  };
};
export default useProfileData;
