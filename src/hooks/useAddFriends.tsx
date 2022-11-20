import { User } from "firebase/auth";
import { writeBatch } from "firebase/firestore";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../firebase/clientApp";

const useAddFriends = () => {
  const [user] = useAuthState(auth);

  //get users snippets

  //create a new snippet
  const addFriend = async (user: User) => {
    try {
      const batch = writeBatch(firestore);
      const newSnippet: FriendSnippet = {
        userId: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
      };
    } catch (error) {
      console.log("Add Friends error", error);
    }
  };
  //Add and remove user.uid

  return {};
};
export default useAddFriends;
