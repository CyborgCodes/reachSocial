import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authModalState } from "../../atoms/AuthModalAtom";
import { communityState } from "../../atoms/communitiesAtom";
import { Post, PostLike, postState } from "../../atoms/postsAtom";
import { auth, firestore, storage } from "../../firebase/clientApp";

const usePosts = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [postStateValue, setPostStateValue] = useRecoilState(postState);
  const currentCommunity = useRecoilValue(communityState).currentCommunity;
  const setAuthModalState = useSetRecoilState(authModalState);

  const onLike = async (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    post: Post,
    like: number,
    communityId: string
  ) => {
    event.stopPropagation();
    //check for a user => if not, open auth modal
    if (!user?.uid) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    try {
      const { numberOfLikes } = post;
      const existingLike = postStateValue.postLikes.find(
        (like) => like.postId === post.id
      );

      const batch = writeBatch(firestore);
      const updatedPost = { ...post };
      const updatedPosts = [...postStateValue.posts];
      let updatedPostLikes = [...postStateValue.postLikes];
      let likeChange = like;

      // new like
      if (!existingLike) {
        //create a new postLike document
        const postLikeRef = doc(
          collection(firestore, "users", `${user?.uid}/postLikes`)
        );

        const newLike: PostLike = {
          id: postLikeRef.id,
          postId: post.id!,
          communityId,
          likeValue: like, //1 or -1
        };

        batch.set(postLikeRef, newLike);
        //add/subtract 1 to/from post.numberOfLikes
        updatedPost.numberOfLikes = numberOfLikes + like;
        updatedPostLikes = [...updatedPostLikes, newLike];
      }
      //Existing like - user have liked on the post before
      else {
        const postLikeRef = doc(
          firestore,
          "users",
          `${user?.uid}/postLikes/${existingLike.id}`
        );
        //Removing a like (up => down)
        if (existingLike.likeValue === like) {
          //subtract 1 to/from post.numberOfLikes
          updatedPost.numberOfLikes = numberOfLikes - like;
          updatedPostLikes = updatedPostLikes.filter(
            (like) => like.id !== existingLike.id
          );

          //delete the postLike document
          batch.delete(postLikeRef);
          likeChange *= -1;
        } else {
          updatedPost.numberOfLikes = numberOfLikes + 2 * like;

          const likeIdx = postStateValue.postLikes.findIndex(
            (like) => like.id === existingLike.id
          );

          updatedPostLikes[likeIdx] = {
            ...existingLike,
            likeValue: like,
          };
          //updating the existing postLike document
          batch.update(postLikeRef, {
            likeValue: like,
          });
        }
      }
      //update state with updated value
      const postIdx = postStateValue.posts.findIndex(
        (item) => item.id === post.id
      );
      updatedPosts[postIdx] = updatedPost;
      setPostStateValue((prev) => ({
        ...prev,
        posts: updatedPosts,
        postLikes: updatedPostLikes,
      }));

      if (postStateValue.selectedPost) {
        setPostStateValue((prev) => ({
          ...prev,
          selectedPost: updatedPost,
        }));
      }
      //update the post document
      const postRef = doc(firestore, "posts", post.id!);
      batch.update(postRef, { numberOfLikes: numberOfLikes + likeChange });

      await batch.commit();
    } catch (error) {
      console.log("onLike error", error);
    }
  };

  const onSelectPost = (post: Post) => {
    setPostStateValue((prev) => ({
      ...prev,
      selectedPost: post,
    }));
    router.push(`/c/${post.communityId}/comments/${post.id}`);
  };

  const onDeletePost = async (post: Post): Promise<boolean> => {
    try {
      // check if image exist, delete if exist
      if (post.imageURL) {
        const imageRef = ref(storage, `posts/${post.id}/image`);
        await deleteObject(imageRef);
      }
      // delete post document from firestore
      const postDocRef = doc(firestore, "posts", post.id!);
      await deleteDoc(postDocRef);

      //update recoil state
      setPostStateValue((prev) => ({
        ...prev,
        posts: prev.posts.filter((item) => item.id !== post.id),
      }));
      return true;
    } catch (error) {
      return false;
    }
  };

  const getCommunityPostLikes = async (communityId: string) => {
    const postLikesQuery = query(
      collection(firestore, "users", `${user?.uid}/postLikes`),
      where("communityId", "==", communityId)
    );

    const postLikeDocs = await getDocs(postLikesQuery);
    const postLikes = postLikeDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setPostStateValue((prev) => ({
      ...prev,
      postLikes: postLikes as PostLike[],
    }));
  };

  useEffect(() => {
    if (!user || !currentCommunity?.id) return;
    getCommunityPostLikes(currentCommunity?.id);
  }, [user, currentCommunity]);

  useEffect(() => {
    if (!user) {
      // Clear user post likes
      setPostStateValue((prev) => ({
        ...prev,
        postLikes: [],
      }));
    }
  }, [user]);

  return {
    postStateValue,
    setPostStateValue,
    onLike,
    onSelectPost,
    onDeletePost,
  };
};
export default usePosts;
